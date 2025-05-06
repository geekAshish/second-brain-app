import { model, Schema, Types } from "mongoose";

const shareContentSchema = new Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  contentId: {
    type: Types.ObjectId,
    ref: "Content",
    required: true,
    unique: true,
  },
});

export const ShareContent = model("shareContent", shareContentSchema);
