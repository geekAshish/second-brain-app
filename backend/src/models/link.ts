import { model, Schema, Types } from "mongoose";

const linkSchema = new Schema({
  hash: {
    type: String,
    required: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const link = model("link", linkSchema);
