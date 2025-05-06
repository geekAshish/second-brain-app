import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { errors } from "../error";
import { StatusCodes } from "http-status-codes";
// import { CustomAPIError } from "../error/custom-error";

export const errorHandlerMiddleware = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    statusCode: (err as any).statuscode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: (err as any)?.message || "Something went wrong, Please try again",
  };

  // default error
  if (err instanceof errors.CustomAPIError) {
    return res
      .status((err as any)?.statusCode)
      .json({ msg: (err as any)?.message });
  }

  // customize mongoose error, for different scenarios
  if ((err as any)?.name === "ValidationError") {
    customError.msg = Object.values((err as any).errors)
      .map((item: any) => {
        return item.message;
      })
      .join(",");
    customError.statusCode = 400;
  }

  if ((err as any)?.name === "CastError") {
    customError.msg = `No item found with id: ${(err as any)?.value}`;
    customError.statusCode = 404;
  }

  if ((err as any)?.code && (err as any)?.code === 11000) {
    customError.statusCode = `Duplicate value entered for ${Object.keys(
      (err as any).keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  // return res
  //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //   .json({ msg: "Something went wrong, Please try again" });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};
