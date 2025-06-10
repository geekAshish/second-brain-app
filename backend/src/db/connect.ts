import mongoose from "mongoose";
import { config } from "../modules/config/config";

const db_uri = config.get("db_uri");

export const connectDB = async () => {
  if (db_uri) {
    return mongoose.connect(db_uri);
  }
};
