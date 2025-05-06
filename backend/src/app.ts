import express from "express";
import cors from "cors";
import { config as c } from "dotenv";

import { config } from "./modules/config/config";
import authRouter from "./routes/auth";
import { connectDB } from "./db/connect";
import { errorHandlerMiddleware } from "./middleware/error-handler";
import { NotFound } from "./error/not-found";
import contentRouter from "./routes/content";
import { auth } from "./middleware/authentication";

c();

const PORT = config.get("port");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/content", auth, contentRouter);

app.use(NotFound as any);
app.use(errorHandlerMiddleware as any);

const main = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("error connecting to db", error);
  }
};

main();
