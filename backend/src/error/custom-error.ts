export class CustomAPIError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const createCustomAPIError = (message: string, statusCode: number) => {
  return new CustomAPIError(message);
};
