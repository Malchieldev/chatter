import { useSelector } from "react-redux";
import type { RootState } from "../store";

import HeaderControl from "./HeaderControl";
import LoadingSpinner from "../UI/LoadingSpinner";

import chatter_logo from "../assets/chatter_logo.svg";

import styled from "./Header.module.css";

type HeaderProps = {
  isAuthenticated: boolean;
};

const Header = (props: HeaderProps) => {
  const dataLoaded = useSelector<RootState, boolean>(
    (state) => state.user.dataLoaded
  );
  const { isAuthenticated } = props;

  return (
    <header className={styled.hdr}>
      <div className={styled.logo}>
        <img alt="logo" src={chatter_logo}></img>
        <h1>{process.env.REACT_APP_NAME}</h1>
      </div>
      {isAuthenticated && dataLoaded && <HeaderControl />}
      {isAuthenticated && !dataLoaded && <LoadingSpinner pixelSize={40} />}
    </header>
  );
};

export default Header;
