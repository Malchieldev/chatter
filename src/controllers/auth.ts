import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { getGoogleUserInfo } from "../google-auth/google-auth";
import { BadRequestError, UnauthorizedError } from "../errors/error-list";

const errAuthFailed = "No google access token provided";
const errNoUserId = "Please provide user id";
const errUserNotFound = "No user found";

const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthorizedError(errAuthFailed);
  }
  const accessToken = authHeader.split(" ")[1];

  const { name, photo, googleId } = await getGoogleUserInfo(accessToken);

  const usersByGoogleId = (await User.getUsersByFilter({ googleId })) as User[];
  let user = usersByGoogleId[0];

  if (!user) {
    user = new User({ name, photo, googleId });
    await user.create();
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(200).json(token);

  await user.update({ $set: { loginDate: new Date() } });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const id = req?.query?.id as string;

  if (!id) {
    throw new BadRequestError(errNoUserId);
  }
  const user = (await User.getById(id)) as User;
  if (!user || !user.testUser) {
    throw new BadRequestError(errUserNotFound);
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(200).json(token);

  await user.update({ $set: { loginDate: new Date() } });
});

const getTestUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.getUsersByFilter({ testUser: true });
  if (users.length === 0) {
    throw new BadRequestError(errUserNotFound);
  }

  const usersData = users.map((user) => {
    const { _id : id, name, photo } = user;
    return { id, name, photo };
  });

  res.status(200).json(usersData);
});

export { googleLogin, login, getTestUsers };
