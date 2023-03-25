import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "./store/user-slice";
import type { AppDispatch, RootState } from "./store";

import { socket } from "./utils/socket";

import useFetch from "./hooks/use-fetch";

import Header from "./components/Header";
import LoginPage from "./pages/Login";
import Main from "./pages/Main";
import Profile from "./components/User/Profile";

import "./App.css";

function App() {
  const isAuthenticated = useSelector<RootState, boolean>(
    (state) => state.user.isAuthenticated
  );
  const activeProfile = useSelector<RootState, string>(
    (state) => state.ui.activeProfile
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(userActions.logIn());
    }
  }, [dispatch]);

  const onSuccessHandler = useCallback(
    (data: RootState["user"]) => {
      dispatch(userActions.updateData(data));
      socket.connect();
      socket.emit("create-user-room", data.id);
    },
    [dispatch]
  );
  const [, , sendRequest] = useFetch("GET", onSuccessHandler);

  useEffect(() => {
    if (isAuthenticated) {
      sendRequest("/user");
    }
  }, [dispatch, isAuthenticated, sendRequest]);

  return (
    <div className="App">
      <Header isAuthenticated={isAuthenticated} />
      {activeProfile && <Profile id={activeProfile} />}
      <Routes>
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </div>
  );
}
export default App;
