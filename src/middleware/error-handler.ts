import { ErrorRequestHandler } from "express";

const errorLog: ErrorRequestHandler = (error, request, response, next) => {
  console.log(error);
  next(error);
};

const errorRespond: ErrorRequestHandler = (error, request, response, next) => {
  response.header("Content-Type", "application/json");
  const status = error.status || 500;
  response.status(status).json({ message: error.message });
};

export { errorLog, errorRespond };
