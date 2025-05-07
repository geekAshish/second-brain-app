import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { errors } from "../error";
import { config } from "../modules/config/config";
import { StatusCodes } from "http-status-codes";

const jwtSecret = config.get("jwtScret");

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new errors.UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload: JwtPayload = jwt.verify(token, jwtSecret) as JwtPayload;

    if (typeof payload === "string") {
      throw new errors.UnauthenticatedError("Authentication invalid");
    }

    if (!payload.userId) {
      throw new errors.UnauthenticatedError("Authentication invalid");
    }

    (req as any).user = {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
    };

    next();
  } catch (error) {
    throw new errors.UnauthenticatedError("Authentication invalid");
  }
};
