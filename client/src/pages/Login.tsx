import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

import TestUsersList from "../components/Login/TestUsers/TestUsersList";
import GoogleSignIn from "../components/Login/Google/GoogleSignIn";

import styled from "./Login.module.css";

const LoginPage = () => {
  const isAuthenticated = useSelector<RootState, boolean>(
    (state) => state.user.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styled["login-container"]}>
      <TestUsersList />
      <div className={styled.OR}>OR</div>
      <GoogleSignIn />
    </div>
  );
};

export default LoginPage;
