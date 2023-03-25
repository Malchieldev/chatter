import { Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthRequest } from "../middleware/auth";
import User from "../models/user";
import { BadRequestError } from "../errors/error-list";

const errNoUserId = "Please provide user id";
const errNoSearchId = "Please provide user id for search";
const errUserNotFound = "No user found";

const currentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req?.id;
  if (!userId) {
    throw new BadRequestError(errNoUserId);
  }

  const user = await User.getById(userId);
  if (!user) {
    throw new BadRequestError(errUserNotFound);
  }

  const { _id: id, name, description, photo, loginDate } = user;

  const userData = {
    id,
    name,
    description,
    photo,
    loginDate: loginDate?.getTime(),
  };

  res.status(200).json(userData);
});

const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req?.id;
  const { userId: searchId } = req.params;

  if (!userId) {
    throw new BadRequestError(errNoUserId);
  }
  if (!searchId) {
    throw new BadRequestError(errNoSearchId);
  }

  const foundUser = await User.getById(searchId);
  if (!foundUser) {
    throw new BadRequestError(errUserNotFound);
  }

  const { _id: id, name, description, photo, loginDate } = foundUser;

  const foundUserData = {
    id,
    name,
    description,
    photo,
    loginDate: loginDate?.getTime(),
    isMine: userId === searchId,
  };

  res.status(200).json(foundUserData);
});

const changeDescription = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req?.id;
    const newDescription = req?.body?.description;

    if (!userId) {
      throw new BadRequestError(errNoUserId);
    }

    const user = await User.updateById(userId, {
      $set: { description: newDescription },
    });

    if (!user) {
      throw new BadRequestError(errUserNotFound);
    }

    const { _id: id, name, description, photo, loginDate } = user;

    const userData = {
      id,
      name,
      description,
      photo,
      loginDate: loginDate?.getTime(),
      isMine: true,
    };

    res.status(200).json(userData);
  }
);

export { currentUser, getUser, changeDescription };
