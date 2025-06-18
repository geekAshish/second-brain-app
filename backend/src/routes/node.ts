import { Router } from "express";
import {
  createNode,
  getChildren,
  getNode,
  deleteNode,
  updateNode,
  getRootNodes,
} from "../controller/node";

const nodeRouter = Router();

// TODO: ONLY ONE API FOR ALL NODES
nodeRouter.route("/single/forallnodes/:id").get(getNode);

nodeRouter.route("/").post(createNode);
nodeRouter.route("/root").get(getRootNodes);
nodeRouter.route("/:id").put(updateNode);
nodeRouter.route("/:id").delete(deleteNode);
nodeRouter.route("/:parentId").get(getChildren);

export default nodeRouter;
