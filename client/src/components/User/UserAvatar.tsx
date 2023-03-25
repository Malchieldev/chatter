import { MouseEventHandler } from "react";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/index";
import { uiActions } from "../../store/ui-slice";

import default_avatar_40 from "../../assets/default_avatar_40.svg";

import styled from "./UserAvatar.module.css";

type UserAvatarProps = {
  id: string;
  alt: string;
  url: string;
  pixelSize: number;
  onClickHandler?: MouseEventHandler;
};

const UserAvatar = (props: UserAvatarProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { id, url, alt, pixelSize, onClickHandler } = props;
  const src = url ? url : default_avatar_40;

  const toggleProfile = () => {
    dispatch(uiActions.toggleProfile(id));
  };
  return (
    <img
      className={styled.avatar}
      alt={alt}
      src={src}
      style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      onClick={onClickHandler ? onClickHandler : toggleProfile}
    ></img>
  );
};

export default UserAvatar;
