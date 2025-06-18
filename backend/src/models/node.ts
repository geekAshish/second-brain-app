import { Schema, Types, model } from "mongoose";

const NodeSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["folder", "file"], required: true },
    parentId: { type: Types.ObjectId, ref: "Node", default: null },
    brainId: { type: Types.ObjectId, ref: "Brain" },
  },
  { timestamps: true }
);

export const NodeModel = model("Node", NodeSchema);
