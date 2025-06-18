import { Request, Response, NextFunction } from "express";
import { recursiveDelete } from "../utils";
import { NodeModel } from "../models/node";

export const createNode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, parentId, content } = req.body;

    const newNode = new NodeModel({
      name,
      type,
      parentId: parentId || null,
      content: content || "",
    });

    const savedNode = await newNode.save();
    res.json(savedNode);
  } catch (err) {
    console.log(err);
  }
};

// Get root nodes (parentId is null)
export const getRootNodes = async (req: Request, res: Response) => {
  try {
    const rootNodes = await NodeModel.find({ parentId: null, type: "folder" });
    res.json(rootNodes);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};

export const getChildren = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { parentId } = req.params;
    const nodes = await NodeModel.find({ parentId: parentId || null });
    res.json(nodes);
  } catch (err) {
    console.log(err);
  }
};

export const getNode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    console.log("this is id ", id);

    let node = [];

    if (id) {
      node = await NodeModel.find({
        parentId: id,
      });
    } else {
      node = await NodeModel.find({
        parentId: null,
        type: "folder",
      });
    }

    res.json(node);
  } catch (err) {
    console.log(err);
  }
};

export const updateNode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const updated = await NodeModel.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

export const deleteNode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await recursiveDelete(req.params.id);
    res.json({ message: "Deleted recursively" });
  } catch (err) {
    console.log(err);
  }
};
