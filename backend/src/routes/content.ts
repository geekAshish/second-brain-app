import { Router } from "express";
import {
  addContent,
  addContentToNode,
  deleteContent,
  getAllContents,
  getAllTags,
  getContentByNodeId,
  updateContent,
} from "../controller/content";
import { createShare, getSharedContent } from "../controller/share";

const contentRouter = Router();

// contentRouter.route("/").post(addContent);
contentRouter.route("/").post(addContentToNode);

// contentRouter.route("/").get(getAllContents);
contentRouter.route("/").get(getContentByNodeId);

contentRouter.route("/tags").get(getAllTags);

contentRouter.route("/").put(updateContent);

contentRouter.route("/").delete(deleteContent);

contentRouter.route("/share-brain").post(createShare);

contentRouter.route("/share-content/:shareLink").get(getSharedContent);

export default contentRouter;
