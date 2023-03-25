import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../errors/error-list";

const errAuthFailed = "Authentication failed";
const errJwtInvalid = "JWT invalid";

export interface AuthRequest extends Request {
  id?: string;
}
const auth = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new UnauthorizedError(errAuthFailed);
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err, decoded) => {
        if (err) {
          throw new UnauthorizedError(err.message);
        }

        if (!decoded) {
          throw new UnauthorizedError(errJwtInvalid);
        }

        const payload = decoded as JwtPayload;
        req.id = payload.id as string;
      }
    );

    next();
  }
);

export default auth;
