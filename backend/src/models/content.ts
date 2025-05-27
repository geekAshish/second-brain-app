import { model, Schema, Types } from "mongoose";

const contentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    link: {
      required: true,
      type: String,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      minlength: 3,
      maxlength: 500,
    },
    // tags: [{ type: Types.ObjectId, ref: "Tag" }],
    tags: [{ type: String }],
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const content = model("Content", contentSchema);
