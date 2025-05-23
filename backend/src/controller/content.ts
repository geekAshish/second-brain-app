import { Request, Response } from "express";
import { content } from "../models/content";
import { StatusCodes } from "http-status-codes";
import { link } from "../models/link";
import { ShareContent } from "../models/shareContent";
import { User } from "../models/user";
import { random } from "../utils";
import { errors } from "../error";

export const getAllContents = async (req: Request, res: Response) => {
  const id = (req as any).user?.userId;

  const contentDetail = await content
    .find({ userId: id })
    .populate("userId", "username")
    .sort({ createdAt: 1 });

  res.status(StatusCodes.OK).json({
    msg: contentDetail,
  });
};

export const addContent = async (req: Request, res: Response) => {
  const { type, title, link, tags, description } = req.body;
  const userId = (req as any).user?.userId;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "unauthorized" });
    return;
  }

  const c = await content.create({
    type,
    title,
    link,
    tags,
    description,
    userId,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "success",
    data: c,
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

  const brain = await content.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!brain) {
    throw new errors.NotFound(`No Brain found`);
  }

  res.status(StatusCodes.OK).json({});
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
