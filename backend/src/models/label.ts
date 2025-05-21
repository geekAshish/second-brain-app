import { model, Schema, Types } from "mongoose";

const labelSchema = new Schema({
  label: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
    unique: true,
  },
  users: [
    {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

export const Label = model("label", labelSchema);
