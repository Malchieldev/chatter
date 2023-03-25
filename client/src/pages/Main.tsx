import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

import Slider from "../components/Chat/Slider";
import MainChat from "../components/Chat/MainChat";

import styled from "./Main.module.css";

const Main = () => {
  const isAuthenticated = useSelector<RootState, boolean>(
    (state) => state.user.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styled.container}>
      <Slider />
      <MainChat />
    </div>
  );
};

export default Main;
