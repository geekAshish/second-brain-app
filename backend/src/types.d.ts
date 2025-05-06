import { Request, Response } from "express";

interface userResponseType {
  userId: string;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: userResponseType;
    }
    interface Response {
      user?: userResponseType;
    }
  }
}
