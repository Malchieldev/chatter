import { Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthRequest } from "../middleware/auth";

import Chat from "../models/chat";
import User from "../models/user";

import { BadRequestError } from "../errors/error-list";

const errNoUserId = "Please provide user id";
const errNoSearchId = "Please provide search id";
const errUserAndSearchIdCantMatch = "User and Search ids cant match";
const errUserNotFound = "No user found";
const errRecipientNotFound = "No chats found";

const chatsData = (chats: Chat[], userId: string) => {
  const chatsData = chats.map((chat) => {
    const recipient = chat.users?.find(
      (user) => user._id.toString() !== userId
    );

    const lastMessage = chat.lastMessage || { text: "", date: 0 };

    return {
      id: chat._id,
      recipient: {
        name: recipient?.name,
        id: recipient?._id,
        photo: recipient?.photo,
      },
      lastMessage: {
        text: lastMessage?.text,
        date: lastMessage?.date,
      },
    };
  });
  return chatsData;
};

const searchChats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req?.id;
  const { userId: searchId } = req.params;

  if (!userId) {
    throw new BadRequestError(errNoUserId);
  }
  if (!searchId) {
    throw new BadRequestError(errNoSearchId);
  }
  if (userId === searchId) {
    throw new BadRequestError(errUserAndSearchIdCantMatch);
  }

  const user = (await User.getById(userId)) as User;
  const recipient = (await User.getById(searchId)) as User;
  if (!user) {
    throw new BadRequestError(errUserNotFound);
  }
  if (!recipient) {
    throw new BadRequestError(errRecipientNotFound);
  }

  const chats = (await Chat.getChatsByFilter({
    $and: [
      { users: { $elemMatch: { _id: user._id } } },
      { users: { $elemMatch: { _id: recipient._id } } },
    ],
  })) as Chat[];

  if (chats.length !== 0) {
    res.status(200).json(chatsData(chats, userId));
    return;
  }

  const users = [user, recipient];
  const newChat = new Chat({
    users: users,
    lastMessage: { text: "", date: 0 },
  });
  await newChat.create();

  res.status(200).json(chatsData([newChat], userId));
});

const getChats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req?.id;
  if (!userId) {
    throw new BadRequestError(errNoUserId);
  }

  const user = await User.getById(userId);
  if (!user) {
    throw new BadRequestError(errUserNotFound);
  }

  const chats = (await Chat.getChatsByFilter({
    users: { $elemMatch: { _id: user._id } },
  })) as Chat[];

  chats.sort((a, b) => {
    const firstDate = a.lastMessage?.date || 0;
    const secondDate = b.lastMessage?.date || 0;

    return secondDate - firstDate;
  });

  res.status(200).json(chatsData(chats, userId));
});

export { searchChats, getChats };
