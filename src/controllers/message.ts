import { Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthRequest } from "../middleware/auth";
import Message from "../models/message";
import Chat from "../models/chat";
import User from "../models/user";
import { BadRequestError } from "../errors/error-list";

const errNoUserId = "Please provide user id";
const errNoChatId = "Please provide chatId";
const errNoMessageId = "Please provide message id";
const errNoText = "Please provide text";
const errUserNotFound = "No user found";
const errChatNotFound = "No chat found";
const errUserNotInChat = "User not found in chat";
const errNoMessage = "No message found";
const errOwnMessage = "You can only modify your own message";

const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req?.id;

  const { text, chatId } = req.body;

  if (!userId) {
    throw new BadRequestError(errNoUserId);
  }
  if (!chatId) {
    throw new BadRequestError(errNoChatId);
  }
  if (!text) {
    throw new BadRequestError(errNoText);
  }

  const user = (await User.getById(userId)) as User;
  const chat = (await Chat.getById(chatId)) as Chat;
  if (!user) {
    throw new BadRequestError(errUserNotFound);
  }
  if (!chat) {
    throw new BadRequestError(errChatNotFound);
  }

  const message = new Message({ author: user, chat, text, sent: new Date() });
  await message.create();

  const usersData = message.chat?.users?.map((user) => {
    return { id: user._id, name: user.name, photo: user.photo };
  });

  const messageData = {
    id: message._id,
    author: {
      id: message.author?._id,
      name: message.author?.name,
      photo: message.author?.photo,
    },
    chat: { id: message?.chat?._id, users: usersData },
    text: message.text,
    date: message.sent?.getTime(),
  };

  res.status(200).json(messageData);

  await chat.update({
    $set: {
      lastMessage: {
        text: message.text,
        date: message.sent?.getTime(),
      },
    },
  });
});

const getMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req?.id;
  const chatId = req?.query?.chatId as string;

  if (!userId) {
    throw new BadRequestError(errNoUserId);
  }
  if (!chatId) {
    throw new BadRequestError(errNoChatId);
  }

  const chat = (await Chat.getById(chatId)) as Chat;
  if (!chat) {
    throw new BadRequestError(errChatNotFound);
  }

  const userInChat = chat.users?.some((user) => user._id.toString() === userId);

  if (!userInChat) {
    throw new BadRequestError(errUserNotInChat);
  }

  const messages = (await Message.getMessagesByFilter({
    "chat._id": chat._id,
  })) as Message[];

  const messagesData = messages.map((message) => {
    const usersData = message.chat?.users?.map((user) => {
      return { id: user._id, name: user.name, photo: user.photo };
    });

    return {
      id: message._id,
      author: {
        id: message.author?._id,
        name: message.author?.name,
        photo: message.author?.photo,
      },
      chat: { id: message?.chat?._id, users: usersData },
      text: message.text,
      date: message.sent?.getTime(),
    };
  });

  res.status(200).json(messagesData);
});

const deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req?.id;
  const { messageId } = req.body;
  if (!userId) {
    throw new BadRequestError(errNoUserId);
  }
  if (!messageId) {
    throw new BadRequestError(errNoMessageId);
  }

  const message = await Message.getById(messageId);
  if (!message) {
    throw new BadRequestError(errNoMessage);
  }

  if (message.author?._id.toString() !== userId) {
    throw new BadRequestError(errOwnMessage);
  }

  await message.delete();

  const previousMessage = await message.getPreviousMessage();

  const previousMessageData = previousMessage
    ? {
        text: previousMessage.text,
        date: previousMessage.sent?.getTime(),
      }
    : { text: "", date: 0 };

  await message.chat?.update({
    $set: {
      lastMessage: previousMessageData,
    },
  });

  const usersData = message.chat?.users?.map((user) => {
    return { id: user._id, name: user.name, photo: user.photo };
  });

  const messageData = {
    id: message._id,
    author: {
      id: message.author?._id,
      name: message.author?.name,
      photo: message.author?.photo,
    },
    chat: { id: message?.chat?._id, users: usersData },
    text: message.text,
    date: message.sent?.getTime(),
    previousMessage: previousMessageData,
  };

  res.status(200).json(messageData);
});

export { sendMessage, getMessages, deleteMessage };
