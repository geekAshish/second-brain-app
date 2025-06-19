import { model, Schema, Types } from "mongoose";

const shareContentSchema = new Schema(
  {
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
    brainId: {
      type: Types.ObjectId,
      ref: "Brain",
    },
    contentId: {
      type: Types.ObjectId,
      ref: "Content",
    },
  },
  { timestamps: true }
);

// brainid or contentid
shareContentSchema.pre("save", function (next) {
  if (!this.brainId && !this.contentId) {
    return next(new Error("Either brainId or contentId must be provided"));
  }

  if (this.brainId && this.contentId) {
    return next(
      new Error("Only one of brainId or contentId should be provided")
    );
  }

  next();
});

shareContentSchema.index(
  { userId: 1, brainId: 1 },
  {
    unique: true,
    partialFilterExpression: { brainId: { $exists: true, $ne: null } },
  }
);

shareContentSchema.index(
  { userId: 1, contentId: 1 },
  {
    unique: true,
    partialFilterExpression: { contentId: { $exists: true, $ne: null } },
  }
);

export const ShareContent = model("ShareContent", shareContentSchema);
