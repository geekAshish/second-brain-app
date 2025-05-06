import { Router } from "express";
import {
  addContent,
  deleteContent,
  getAllContents,
  getShareContent,
  getShareLink,
  shareAllContents,
  shareContent,
  updateContent,
} from "../controller/content";

const contentRouter = Router();

contentRouter.route("/").post(addContent);

contentRouter.route("/").get(getAllContents);

contentRouter.route("/").put(updateContent);

contentRouter.route("/").delete(deleteContent);

contentRouter.route("/share").post(shareAllContents);

contentRouter.route("/share-content").post(shareContent);

contentRouter.route("/:shareLink").get(getShareLink);

contentRouter.route("/share-content/:shareLink").get(getShareContent);

export default contentRouter;
