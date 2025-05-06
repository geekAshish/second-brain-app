import { Request, Response } from "express";
import zod from "zod";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user";
import { errors } from "../error";

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

  console.log(success);

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
    .json({ user: { username: username, email: email }, access_token: token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new errors.BadRequest("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new errors.UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(String(password));

  if (!isPasswordCorrect) {
    throw new errors.UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJwt();

  res.status(StatusCodes.OK).json({ user: { email }, access_token: token });
};
