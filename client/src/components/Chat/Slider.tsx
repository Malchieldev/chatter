import { useEffect, useState, ChangeEvent, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/index";
import { chatsActions } from "../../store/chats-slice";

import { socket } from "../../utils/socket";
import useFetch from "../../hooks/use-fetch";

import LoadingSpinner from "../../UI/LoadingSpinner";
import ChatItem from "./ChatItem";
import Input from "../../UI/Input";

import styled from "./Slider.module.css";

type Chat = RootState["chats"]["chats"][0];

const Slider = () => {
  const { chats } = useSelector<RootState, RootState["chats"]>(
    (state) => state.chats
  );
  const dispatch = useDispatch<AppDispatch>();
  const [searchId, setSearchId] = useState("");

  const userId = useSelector<RootState, string>((state) => state.user.id);

  const onSuccessHandler = useCallback(
    (data: RootState["chats"]["chats"]) => {
      dispatch(chatsActions.loadAndSort(data));
    },
    [dispatch]
  );

  const onErrorHandler = useCallback(
    () => dispatch(chatsActions.loadAndSort([])),
    [dispatch]
  );
  const [isLoading, , sendRequest, setIsLoading] = useFetch(
    "GET",
    onSuccessHandler,
    onErrorHandler
  );
  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchId(event.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      sendRequest(`/chats/${searchId}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sendRequest, searchId, setIsLoading]);

  //sockets>>>:
  useEffect(() => {
    const updateChatSliderHandler = (chatData: Chat) =>
      dispatch(chatsActions.updateAndSort(chatData));

    if (socket && userId) {
      socket?.on("update-chats-slider", updateChatSliderHandler);
    }
    return () => {
      socket.off("update-chats-slider", updateChatSliderHandler);
    };
  }, [dispatch, userId]);
  //sockets<<<:

  return (
    <div className={styled.slider}>
      <Input
        placeholder="Search (enter user id)..."
        value={searchId}
        onChange={onChangeHandler}
      />
      <div className={styled["slider-content"]}>
        {!isLoading && (
          <ul>
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                id={chat.id}
                recipientId={chat.recipient.id}
                name={chat.recipient.name}
                photo={chat.recipient.photo}
                text={chat.lastMessage.text}
                dateAsNumber={chat.lastMessage.date}
              />
            ))}
          </ul>
        )}
        {isLoading && <LoadingSpinner pixelSize={80} />}
      </div>
    </div>
  );
};

export default Slider;
