import { CustomAPIError } from "./custom-error";
import { BadRequest } from "./bad-request";
import { UnauthenticatedError } from "./unauthenticated";
import { NotFound } from "./not-found";

export const errors = {
  CustomAPIError,
  BadRequest,
  UnauthenticatedError,
  NotFound,
};
