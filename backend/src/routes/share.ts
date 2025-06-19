import { Router } from "express";
import { createShare, getSharedContent } from "../controller/share";

const shareRouter = Router();

shareRouter.route("/").post(createShare);

shareRouter.route("/:hash").get(getSharedContent);

export default shareRouter;
