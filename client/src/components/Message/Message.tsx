import { useState, useCallback } from "react";

import useFetch from "../../hooks/use-fetch";

import { toTodayFormat } from "../../utils/dates";

import IconButton from "../../UI/IconButton";
import LoadingSpinner from "../../UI/LoadingSpinner";

import trash_32 from "../../assets/trash_32.svg";
import styled from "./Message.module.css";

type MessageProps = {
  id: string;
  text: string;
  dateAsNumber: number;
  isMine: boolean;
  deleteMessage: Function;
};

const Message = (props: MessageProps) => {
  const { id, text, dateAsNumber, isMine, deleteMessage } = props;
  const dateString = toTodayFormat(new Date(dateAsNumber));

  const [showDelete, setShowDelete] = useState(false);
  const [isLoading, error, sendRequest] = useFetch("DELETE", deleteMessage);

  const handleMouseOver = () => {
    setShowDelete(true);
  };
  const handleMouseOut = () => {
    setShowDelete(false);
  };

  const onDeleteHandler = useCallback(() => {
    sendRequest("/messages", { messageId: id });
  }, [id, sendRequest]);

  return (
    <div
      className={
        isMine
          ? `${styled.container} ${styled["container-mine"]}`
          : `${styled.container}`
      }
    >
      <div
        className={styled.message}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {!isLoading && !error && (
          <>
            <p>{text}</p>
            {showDelete && isMine && (
              <IconButton
                alt="delete"
                icon={trash_32}
                pixelSize={20}
                onClick={onDeleteHandler}
              />
            )}
          </>
        )}
        {!isLoading && error}
        {isLoading && <LoadingSpinner pixelSize={40} />}
      </div>

      <span>{dateString}</span>
    </div>
  );
};

export default Message;
