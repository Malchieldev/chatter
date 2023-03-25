import { StatusCodes } from "http-status-codes";

class CustomError extends Error {
  status!: number;
  constructor(message: string) {
    super(message);
  }
}

class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;
  }
}
class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}
class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message);
    this.status = StatusCodes.NOT_FOUND;
  }
}

export { BadRequestError, UnauthorizedError, NotFoundError };
