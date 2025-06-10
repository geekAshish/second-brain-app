import express from "express";
import cors from "cors";
import { config as c } from "dotenv";
import swaggerUi from "swagger-ui-express";

import { errorHandlerMiddleware } from "./middleware/error-handler";
import { auth } from "./middleware/authentication";

import { connectDB } from "./db/connect";
import { config } from "./modules/config/config";

import authRouter from "./routes/auth";
import contentRouter from "./routes/content";

import { NotFound } from "./error/not-found";
import swaggerDocument from "./docs/swagger.json";

c();

const PORT = config.get("port");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {},
  })
);

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
