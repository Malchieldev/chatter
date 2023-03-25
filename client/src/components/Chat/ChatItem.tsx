import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { uiActions } from "../../store/ui-slice";

import { isToday, toTodayFormat, toGlobalFormat } from "../../utils/dates";

import UserAvatar from "../User/UserAvatar";

import styled from "./ChatItem.module.css";

type ChatItemProps = {
  id: string;
  recipientId: string;
  name: string;
  photo: string;
  text: string;
  dateAsNumber: number;
};

const getTimeString = (date: Date) => {
  return isToday(date) ? toTodayFormat(date) : toGlobalFormat(date);
};

const ChatItem = (props: ChatItemProps) => {
  const { id, recipientId, name, photo, text, dateAsNumber } = props;
  const activeChatId = useSelector<RootState, string>(
    (state) => state.ui.activeChatId
  );
  const dispatch = useDispatch<AppDispatch>();

  let dateString = dateAsNumber !== 0 ? getTimeString(new Date(dateAsNumber)) : "";

  const onClickHandler = () => {
    dispatch(uiActions.toggleChat(id));
  };

  const isActive = activeChatId === id;

  return (
    <div
      className={`${styled.container} ${isActive ? styled.active : null}`}
      onClick={onClickHandler}
    >
      <UserAvatar alt="chat" pixelSize={40} url={photo} id={recipientId} />
      <div className={styled["content"]}>
        <div className={styled["content-row"]}>
          <h4>{name}</h4>
          <time>{dateString}</time>
        </div>
        <span>{text}</span>
      </div>
    </div>
  );
};
export default ChatItem;
