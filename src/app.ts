import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";

//enviroment
import * as dotenv from "dotenv";
dotenv.config();

//db:
import mongo from "./db/mongo";

//middleware:
import notFoundMiddleware from "./middleware/not-found";
import { errorLog, errorRespond } from "./middleware/error-handler";
import authenticateUser from "./middleware/auth";

//routes:
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import chatsRoute from "./routes/chats";
import messagesRoute from "./routes/messages";

const oneMinute = 60000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: oneMinute,
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", authenticateUser, userRoute);
app.use("/api/v1/chats", authenticateUser, chatsRoute);
app.use("/api/v1/messages", authenticateUser, messagesRoute);
app.use(notFoundMiddleware);
app.use(errorLog);
app.use(errorRespond);
async function start() {
  try {
    await mongo.init();
  } catch (error) {
    console.log(error);
    return;
  }
  httpServer.listen(process.env.ROOT_SERVER_PORT);
}
start();

io.on("connection", (socket) => {
  socket.on("create-user-room", (userId) => {
    socket.join(userId);
  });

  socket.on("leave-user-room", (userId) => {
    socket.leave(userId);
  });

  socket.on("create-chat-room", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leave-chat-room", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("new-message", (message, chatData) => {
    const recipientId = chatData.recipient.id;
    const chatId = message.chat.id;
    socket.to(recipientId).emit("update-chats-slider", chatData);
    socket.to(chatId).emit("current-chat-message-recivied", message);
  });

  socket.on("delete-message", (message, chatData) => {
    const recipientId = chatData.recipient.id;
    const chatId = message.chat.id;
    socket.to(recipientId).emit("update-chats-slider", chatData);
    socket.to(chatId).emit("current-chat-message-deleted", message);
  });
});
