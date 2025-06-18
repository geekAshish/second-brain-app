import { model, Schema, Types } from "mongoose";

const brainModel = new Schema({
  contents: [{ type: Types.ObjectId, ref: "Content" }],
});

export const BrainModel = model("Brain", brainModel);
