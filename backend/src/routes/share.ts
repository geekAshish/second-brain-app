import { Router } from "express";
import { createShare, getSharedContent } from "../controller/share";
import { auth } from "../middleware/authentication";

const shareRouter = Router();

shareRouter.route("/").post(auth, createShare);

shareRouter.route("/:hash").get(getSharedContent);

export default shareRouter;
