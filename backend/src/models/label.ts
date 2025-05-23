import { model, Schema, Types } from "mongoose";

const tagSchema = new Schema({
  tag: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
  },
  users: [
    {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

export const Tag = model("tag", tagSchema);
