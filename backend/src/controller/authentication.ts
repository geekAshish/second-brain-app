import { Request, Response } from "express";
import zod from "zod";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { User } from "../models/user";
import { errors } from "../error";
import { config } from "../modules/config/config";

const registerShema = zod.object({
  username: zod.string({
    required_error: "User Name is required",
    invalid_type_error: "User Name must be a string",
  }),
  email: zod.string(),
  password: zod.any(),
});

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const { success } = registerShema.safeParse(req.body);

  if (!email || !password) {
    throw new errors.BadRequest("Please provide email and password");
  }

  const isAlreadyUser = await User.findOne({ email });

  if (isAlreadyUser) {
    throw new errors.BadRequest("User already exists");
  }

  const user = await User.create({ username, email, password });

  const token = user.createJwt();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { username: username, email: email }, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new errors.BadRequest("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new errors.BadRequest("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(String(password));

  if (!isPasswordCorrect) {
    throw new errors.BadRequest("Invalid Credentials");
  }

  const token = user.createJwt();

  res.status(StatusCodes.OK).json({ user: { email }, token });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken: string | undefined = (
    req.headers["token"] as string
  )?.split(" ")[1];

  if (!refreshToken) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(
    refreshToken,
    config.get("refresh_jwt_scret"),
    async (
      err: VerifyErrors | null,
      decoded: string | JwtPayload | undefined
    ) => {
      if (err || !decoded || typeof decoded === "string") {
        res.status(406).json({ message: "Unauthorized" });
        return;
      }

      const user = await User.findOne({ _id: decoded.userId });

      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const token = user.createJwt();

      res.status(StatusCodes.OK).json({ token });
    }
  );
};
