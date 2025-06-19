import { Request, Response } from "express";
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";

import { Tag } from "../models/tag";
import { content } from "../models/content";

import { random } from "../utils";
import { errors } from "../error";
import { NodeModel } from "../models/node";
import { BrainModel } from "../models/brain";

// NOT USING IT NOW IT'S OLD
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

    const totalContent = await content.countDocuments(query);

    let results = content
      .find(query)
      .populate("userId", "username")
      .populate("tags", "tag")
      .sort({ createdAt: -1 });

    const page: number = Number(req.query?.page || 1);
    const size: number = Number(req.query?.size || 2);
    const skip: number = (page - 1) * size;

    results = results.skip(skip).limit(size);

    const contents = await results;

    res.status(StatusCodes.OK).json({
      data: contents,
      page: { page, size, totalContent },
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch contents",
      error: error.message,
    });
  }
};

export const getContentByNodeId = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const brainId = req.query.brainId as string | undefined;
    const tag = req.query.tag as string | undefined;

    const page: number = Number(req.query?.page || 1);
    const size: number = Number(req.query?.size || 2);
    const skip: number = (page - 1) * size;

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: User ID missing",
      });
      return;
    }

    const brain = await BrainModel.findById(brainId);

    if (!brain || !brain.contents || brain.contents.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Brain not found or contains no contents",
      });
      return;
    }

    // making query
    const query: any = {
      _id: { $in: brain.contents },
    };

    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Total count for pagination info
    // const totalContents = brain.contents.length;
    const totalContents = await content.countDocuments(query);

    const paginatedContents = await content
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size)
      .populate({
        path: "tags",
        select: "tag -_id",
      });

    if (!brain) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Brain not found" });
      return;
    }

    res.status(StatusCodes.OK).json({
      contents: paginatedContents,
      total: totalContents,
      page,
      size,
    });
    return;
  } catch (error) {
    console.error("Error fetching content by node ID:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch contents",
      // error: error.message,
    });
  }
};

// NOT USING IT NOW IT'S OLD
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

export const addContentToNode = async (req: Request, res: Response) => {
  try {
    const { type, link, title, description, tags, nodeId } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ msg: "unauthorized" });
      return;
    }

    if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid tags format" });
    }

    const node = await NodeModel.findById(nodeId);
    if (!node) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Node not found" });
      return;
    }

    // If node doesn't have brain, create one
    let brain: any = null;
    if (!node.brainId) {
      brain = await BrainModel.create({ contents: [] });
      node.brainId = brain._id;
      await node.save();
    } else {
      brain = await BrainModel.findById(node.brainId);
    }

    if (!brain) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to retrieve or create brain" });
      return;
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
      link,
      title,
      description,
      tags: tagObjectIds,
      userId,
    });

    brain.contents.push(newContent._id);
    await brain.save();

    console.log(newContent);

    res.status(StatusCodes.CREATED).json({ newContent, brainId: node.brainId });
  } catch (error) {
    console.error("Error adding content to node:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server Error", error });
  }
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
