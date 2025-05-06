import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./custom-error";

export class BadRequest extends CustomAPIError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
