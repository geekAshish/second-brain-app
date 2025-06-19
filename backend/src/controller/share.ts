import { Request, Response } from "express";
import { ShareContent } from "../models/shareContent";
import { nanoid } from "nanoid";
import { StatusCodes } from "http-status-codes";

export const createShare = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { brainId, contentId } = req.body;

    if (!brainId && !contentId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Either brainId or contentId must be provided.",
      });
      return;
    }

    if (brainId && contentId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Only one of brainId or contentId should be provided.",
      });
      return;
    }

    // ✅ Check for existing share by user and (brain or content)
    const existingShare = await ShareContent.findOne({
      userId,
      ...(brainId ? { brainId } : {}),
      ...(contentId ? { contentId } : {}),
    });

    if (existingShare) {
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Share",
        shareHash: existingShare.hash,
        share: existingShare,
      });
      return;
    }

    const hash = nanoid(10);

    console.log("after that create on db", contentId, brainId);

    const newShare = await ShareContent.create({
      userId,
      hash,
      brainId: brainId || null,
      contentId: contentId || null,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      shareHash: hash,
      share: newShare,
    });
  } catch (error) {
    console.error("Share creation failed:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create share",
    });
  }
};

export const getSharedContent = async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;

    const share = await ShareContent.findOne({ hash })
      .populate("contentId")
      .populate({
        path: "brainId",
        populate: {
          path: "contents",
          populate: {
            path: "tags",
            select: "tag -_id",
          },
        },
      });

    if (!share) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Shared content not found",
      });
      return;
    }

    const sharedData = share.contentId
      ? { type: "content", data: share.contentId }
      : { type: "brain", data: share.brainId };

    res.status(StatusCodes.OK).json({
      success: true,
      shared: sharedData,
    });
  } catch (error) {
    console.error("Failed to get shared content:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving shared content",
    });
  }
};
