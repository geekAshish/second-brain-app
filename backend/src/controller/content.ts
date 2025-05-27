import { Request, Response } from "express";
import { content } from "../models/content";
import { StatusCodes } from "http-status-codes";
import { link } from "../models/link";
import { ShareContent } from "../models/shareContent";
import { User } from "../models/user";
import { random } from "../utils";
import { errors } from "../error";
import { Tag } from "../models/tag";
import { Types } from "mongoose";

export const getAllContents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const tag = req.query.tag as string | undefined;

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: User ID missing",
      });
      return;
    }

    // Base query: filter by userId
    const query: any = { userId };

    // If tag is provided, filter by it
    if (tag) {
      query.tags = { $in: [tag] }; // Match if tag is in the tags array
    }

    const contents = await content
      .find(query)
      .populate("userId", "username")
      .populate("tags", "tag")
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      data: contents,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch contents",
      error: error.message,
    });
  }
};

export const addContent = async (req: Request, res: Response) => {
  const { type, title, link, tags, description } = req.body;

  const userId = (req as any).user?.userId;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "unauthorized" });
    return;
  }

  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid tags format" });
  }

  const tagObjectIds: Types.ObjectId[] = [];

  for (const tagName of tags) {
    // Try to find existing tag
    let tag = await Tag.findOne({ tag: tagName });

    if (tag) {
      tag.count += 1;
      await tag.save();
    } else {
      tag = await Tag.create({
        tag: tagName,
        count: 1,
        users: userId,
      });
    }

    tagObjectIds.push(tag._id);
  }

  const newContent = await content.create({
    type,
    title,
    link,
    tags: tagObjectIds,
    description,
    userId,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "success",
    data: newContent,
  });
};

export const updateContent = async (req: Request, res: Response) => {
  const { id, title, link, tags, description } = req.body;
  const userId = (req as any).user?.userId;

  if (title === "" || link === "") {
    throw new errors.BadRequest(`title or link can't be empty`);
  }

  const filter = { _id: id, userId: userId };
  const update = { title, link, tags, description };

  await content.findOneAndUpdate(filter, update);

  res.status(StatusCodes.OK).json({
    msg: "brain updated successfully...",
  });
};

export const deleteContent = async (req: Request, res: Response) => {
  const { id } = req.body;
  const userId = (req as any).user?.userId;

  if (!id) {
    throw new errors.BadRequest("Brain not available");
  }

  const existingContent = await content.findOne({ _id: id, userId });

  if (!existingContent) {
    throw new errors.NotFound(`No Brain found`);
  }

  const associatedTagIds = existingContent.tags;

  await content.findOneAndDelete({ _id: id, userId });

  for (const tagId of associatedTagIds) {
    const usageCount = await content.countDocuments({ tags: tagId });

    if (usageCount === 0) {
      await Tag.findByIdAndDelete(tagId);
    } else {
      await Tag.findByIdAndUpdate(tagId, { $inc: { count: -1 } });
    }
  }

  res.status(StatusCodes.OK).json({ msg: "Content deleted" });
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: User ID missing",
      });
      return;
    }

    const tags = await Tag.find({ users: userId }, { tag: 1, count: 1 }).sort({
      count: -1,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: tags,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch tags",
      error: err,
    });
  }
};

export const shareAllContents = async (req: Request, res: Response) => {
  const { share } = req.body;

  if (share) {
    const existingLink = await link.findOne({
      userId: (req as any).user?.userId,
    });

    if (existingLink) {
      res.json({ hash: existingLink.hash });
      return;
    }

    const hash = random(10);
    await link.create({
      hash: hash,
      userId: (req as any).user?.userId,
    });

    res.json({ hash });
  } else {
    await link.deleteOne({
      userId: (req as any).user?.userId,
    });

    res.json({ msg: "Removed link" });
  }
};

export const getShareLink = async (req: Request, res: Response) => {
  const shareLink = (req as any)?.params?.shareLink;

  const linkDetail = await link.findOne({
    hash: shareLink,
  });

  if (!linkDetail) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "not found" });
    return; // early return
  }

  const contentDetail = await content
    .find({
      userId: linkDetail.userId,
    })
    .populate("userId", "username");

  res.json({
    content: contentDetail,
  });
};

export const shareContent = async (req: Request, res: Response) => {
  const { share, contentId } = req.body;
  const userId = (req as any).user?.userId;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "unauthorized" });
    return;
  }

  if (!contentId) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid content Id" });
  }

  if (share) {
    const existingLink = await ShareContent.findOne({
      contentId: contentId,
    });

    if (existingLink) {
      res.json({ hash: existingLink.hash });
      return;
    }

    const hash = random(10);
    await ShareContent.create({
      hash: hash,
      userId: (req as any).user?.userId,
      contentId: contentId,
    });

    res.json({ hash });
  } else {
    await ShareContent.deleteOne({
      contentId: contentId,
    });

    res.json({ msg: "Removed link" });
  }
};

export const getShareContent = async (req: Request, res: Response) => {
  const shareLink = (req as any)?.params?.shareLink;

  const linkDetail = await ShareContent.findOne({
    hash: shareLink,
  })
    .populate({ path: "contentId" })
    .populate({ path: "userId", select: "username" });

  if (!linkDetail) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "not found" });
    return; // early return
  }

  res.json({
    content: linkDetail,
  });
};
