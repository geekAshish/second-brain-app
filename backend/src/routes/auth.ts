import { Router } from "express";
import { login, refresh, register } from "../controller/authentication";

const authRouter = Router();

authRouter.route("/register").post(register);

authRouter.route("/login").post(login);

authRouter.route("/refresh-token").get(refresh);

export default authRouter;
