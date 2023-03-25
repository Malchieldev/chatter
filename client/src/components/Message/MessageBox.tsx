import { RootState } from "../../store";
import { useSelector } from "react-redux";

import Message from "./Message";
import UserAvatar from "../User/UserAvatar";

import type { MessageType } from "../Chat/MainChat";

import styled from "./MessageBox.module.css";

type MessageBoxProps = {
  messages: MessageType[];
  author: RootState["chats"]["chats"][0]["recipient"];
  deleteMessage: Function;
};
const MessageBox = (props: MessageBoxProps) => {
  const userId = useSelector<RootState, string>((state) => state.user.id);
  const { messages, author, deleteMessage } = props;

  const isMyMessages = author.id === userId;

  return (
    <div
      className={
        isMyMessages
          ? `${styled.container} ${styled["container-mine"]}`
          : `${styled.container}`
      }
    >
      <UserAvatar
        alt={"user"}
        url={author.photo}
        pixelSize={40}
        id={author.id}
      />
      <div className={styled.content}>
        <h5>{author.name}</h5>
        {messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            text={message.text}
            dateAsNumber={message.date}
            isMine={isMyMessages}
            deleteMessage={deleteMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageBox;
