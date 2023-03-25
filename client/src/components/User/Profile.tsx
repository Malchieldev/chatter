import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../store/index";
import { uiActions } from "../../store/ui-slice";

import useFetch from "../../hooks/use-fetch";

import IconButton from "../../UI/IconButton";
import ProfileDesciption from "./ProfileDesciption";
import Modal from "../../UI/Modal";
import LoadingSpinner from "../../UI/LoadingSpinner";
import UserAvatar from "./UserAvatar";

import { toGlobalFormat } from "../../utils/dates";

import styled from "./Profile.module.css";

import copy_40 from "../../assets/copy_40.svg";

type IProfile = {
  name: string;
  photo: string;
  description: string;
  loginDate: string;
  isMine: boolean;
};

type ProfileProps = {
  id: string;
};

const Profile = (props: ProfileProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { id } = props;
  const [profileData, setProfileData] = useState<IProfile>({
    name: "",
    photo: "",
    description: "",
    loginDate: "",
    isMine: false,
  });
  const [isCopied, setIsCopied] = useState(false);

  const onSuccessHandler = useCallback((data: any) => {
    const loginDateString =
      data.loginDate !== 0 ? toGlobalFormat(new Date(data.loginDate)) : "";

    const newData:IProfile  = {
      name: data.name,
      description: data.description,
      photo: data.photo,
      loginDate: loginDateString,
      isMine: data.isMine,
    };
    setProfileData(newData);
  }, []);

  const [isLoading, error, sendRequest] = useFetch("GET", onSuccessHandler);

  useEffect(() => {
    sendRequest(`/user/${id}`);
  }, [dispatch, id, sendRequest]);

  const onClose = () => {
    dispatch(uiActions.toggleProfile(""));
  };

  const copyClickHandler = () => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const changeProfileDataHandler = (data: {
    description?: string;
    photo?: string;
  }) => {
    setProfileData((prevState) => {
      return { ...prevState, ...data };
    });
  };

  return (
    <Modal onClose={onClose}>
      {!isLoading && !error && (
        <div className={styled.container}>
          <UserAvatar
            id={id}
            alt={"profile"}
            url={profileData.photo}
            pixelSize={100}
            onClickHandler={() => {}}
          />
          <div className={styled.fields}>
            <h3>{profileData.name}</h3>
            <div className={styled.field}>
              <ProfileDesciption
                isEditibale={profileData.isMine}
                description={profileData.description}
                onChangeDescription={changeProfileDataHandler}
              />
            </div>
            <div className={styled.field}>
              <span className={styled.id}>{id}</span>
              <IconButton
                alt={"copy"}
                pixelSize={20}
                icon={copy_40}
                onClick={copyClickHandler}
              />
              {isCopied && <div className={styled.copied}>copied!</div>}
            </div>
            {profileData.loginDate && (
              <span
                className={styled["last-online"]}
              >{`Last online: ${profileData.loginDate}`}</span>
            )}
          </div>
        </div>
      )}
      {!isLoading && error}
      {isLoading && <LoadingSpinner pixelSize={80} />}
    </Modal>
  );
};

export default Profile;
