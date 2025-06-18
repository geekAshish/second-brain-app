import { Router } from "express";
import {
  addContent,
  addContentToNode,
  deleteContent,
  getAllContents,
  getAllTags,
  getContentByNodeId,
  getShareContent,
  getShareLink,
  shareAllContents,
  shareContent,
  updateContent,
} from "../controller/content";

const contentRouter = Router();

// contentRouter.route("/").post(addContent);
contentRouter.route("/").post(addContentToNode);

// contentRouter.route("/").get(getAllContents);
contentRouter.route("/").get(getContentByNodeId);

contentRouter.route("/tags").get(getAllTags);

contentRouter.route("/").put(updateContent);

contentRouter.route("/").delete(deleteContent);

contentRouter.route("/share-brain").post(shareAllContents);

contentRouter.route("/share-content").post(shareContent);

contentRouter.route("/:shareLink").get(getShareLink);

contentRouter.route("/share-content/:shareLink").get(getShareContent);

export default contentRouter;
