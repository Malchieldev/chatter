import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/index";
import { uiActions } from "../store/ui-slice";

import { socket } from "../utils/socket";

import IconButton from "../UI/IconButton";
import UserAvatar from "./User/UserAvatar";

import logout_32 from "../assets/logout_32.svg";

import styled from "./HeaderControl.module.css";

const HeaderControl = () => {
  const user = useSelector<RootState, RootState["user"]>((state) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const { id, name, photo } = user;

  const firstName = name.split(" ")[0];

  const onLogOutHandler = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    socket.emit("leave-user-room", user.id);
    socket.disconnect();
  };

  return (
    <div className={styled["profile-controls"]}>
      <div className={styled.profile}>
        <UserAvatar alt="profile" url={photo} pixelSize={40} id={id} />
        <h4
          onClick={() => {
            dispatch(uiActions.toggleProfile(id));
          }}
        >
          {firstName}
        </h4>
      </div>
      <IconButton
        alt={"logout"}
        icon={logout_32}
        pixelSize={30}
        onClick={onLogOutHandler}
      />
    </div>
  );
};

export default HeaderControl;
