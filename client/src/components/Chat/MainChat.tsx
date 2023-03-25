import { useEffect, useState, FormEvent, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/index";

import { chatsActions } from "../../store/chats-slice";

import { socket } from "../../utils/socket";
import useFetch from "../../hooks/use-fetch";

import MessageBox from "../Message/MessageBox";
import Input from "../../UI/Input";
import IconButton from "../../UI/IconButton";
import LoadingSpinner from "../../UI/LoadingSpinner";

import send_48 from "../../assets/send_48.svg";

import styled from "./MainChat.module.css";

type Chat = RootState["chats"]["chats"][0];

type Recipient = RootState["chats"]["chats"][0]["recipient"];

type MessageType = {
  id: string;
  author: Recipient;
  chat: { id: string; users: Recipient[] };
  text: string;
  date: number;
  previousMessage?: { text: string; date: number };
};

type GroupedMessages = { groupedAmount: number; lastIndex: number }[];

const groupMessages = (messages: MessageType[]): GroupedMessages => {
  let counter = 1;
  const groupedMessages: GroupedMessages = [];
  messages.forEach((mes, i, arr) => {
    if (i === arr.length - 1 || !(mes.author.id === arr[i + 1].author.id)) {
      groupedMessages.push({ groupedAmount: counter, lastIndex: i });
      counter = 0;
    }
    counter++;
  });
  return groupedMessages;
};

const MainChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageText, setMessageText] = useState("");

  const chatId = useSelector<RootState, string>(
    (state) => state.ui.activeChatId
  );
  const userId = useSelector<RootState, string>((state) => state.user.id);

  const dispatch = useDispatch<AppDispatch>();

  //onLoad
  const getMessagesOnSuccessHandler = useCallback((data: MessageType[]) => {
    setMessages(data);
  }, []);

  const [isLoading, error, getMessages] = useFetch(
    "GET",
    getMessagesOnSuccessHandler
  );

  //onSendMessage
  const sendMessageOnSuccessHandler = useCallback(
    (message: MessageType) => {
      setMessages((prevState) => [...prevState, message]);

      const lastMessage = { text: message.text, date: message.date };
      const recipient = message.chat.users?.find(
        (user) => user.id !== userId
      ) as Recipient;

      const chatData: Chat = {
        id: message.chat.id,
        recipient,
        lastMessage,
      };

      dispatch(chatsActions.updateAndSort(chatData));

      socket?.emit("new-message", message, chatData);
    },
    [dispatch, userId]
  );
  const [messageIsSending, , sendMessage] = useFetch(
    "POST",
    sendMessageOnSuccessHandler
  );

  const deleteMessage = useCallback(
    (message: MessageType) => {
      setMessages((prevState) =>
        prevState.filter((curMessage) => curMessage.id !== message.id)
      );

      const lastMessage = {
        text: message.previousMessage?.text || "",
        date: message.previousMessage?.date || 0,
      };
      const recipient = message.chat.users?.find(
        (user) => user.id !== userId
      ) as Recipient;

      const chatData: Chat = { id: message.chat.id, recipient, lastMessage };

      dispatch(chatsActions.updateAndSort(chatData));

      socket?.emit("delete-message", message, chatData);
    },
    [dispatch, userId]
  );

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();

    if (!messageText) {
      return;
    }
    sendMessage(`/messages`, { text: messageText, chatId });
    setMessageText("");
  };

  useEffect(() => {
    if (chatId) {
      getMessages(`/messages`, { chatId });
    }
  }, [getMessages, chatId]);

  //sockets>>>:
  useEffect(() => {
    const messageReciviedHandler = (message: MessageType) =>
      setMessages((prevState) => [...prevState, message]);
    const messageDeletedHandler = (message: MessageType) =>
      setMessages((prevState) =>
        prevState.filter((curMessage) => curMessage.id !== message.id)
      );

    if (socket && chatId) {
      socket?.emit("create-chat-room", chatId);
      socket?.on("current-chat-message-recivied", messageReciviedHandler);
      socket?.on("current-chat-message-deleted", messageDeletedHandler);

      return () => {
        socket?.emit("leave-chat-room", chatId);
        socket.off("current-chat-message-recivied", messageReciviedHandler);
        socket.off("current-chat-message-deleted", messageDeletedHandler);
      };
    }
  }, [dispatch, chatId]);
  //sockets<<<

  const groupedMessages = groupMessages(messages);

  return (
    <div className={styled.container}>
      {chatId && (
        <div className={styled.content}>
          {/* #Вопрос: норм ли здесь форму? сделал чтобы по энтеру можно было ввод делать */}
          <form onSubmit={onSubmitHandler} className={styled.send}>
            <Input
              placeholder="Type here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            {messageIsSending && <LoadingSpinner pixelSize={30} />}
            {!messageIsSending && (
              <IconButton alt="send" icon={send_48} pixelSize={30} />
            )}
          </form>

          <div className={styled.messages}>
            {!isLoading && !error && (
              <>
                {groupedMessages.map((group) => (
                  <MessageBox
                    key={`messageBox_id${group.lastIndex}`}
                    author={messages[group.lastIndex].author}
                    messages={messages.slice(
                      group.lastIndex + 1 - group.groupedAmount,
                      group.lastIndex + 1
                    )}
                    deleteMessage={deleteMessage}
                  />
                ))}
              </>
            )}
            {!isLoading && error}
            {isLoading && <LoadingSpinner pixelSize={200} />}
          </div>
        </div>
      )}
      {!chatId && <p>Please, select a chat</p>}
    </div>
  );
};
export default MainChat;
export type { MessageType };
