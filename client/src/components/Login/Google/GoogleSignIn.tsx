import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";

import { userActions } from "../../../store/user-slice";
import type { AppDispatch } from "../../../store/index";

import useFetch from "../../../hooks/use-fetch";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import google_logo from "../../../assets/google_logo.svg";

const GoogleSignIn = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, , sendRequest] = useFetch("GET", (data: string) => {
    localStorage.setItem("token", data);
    dispatch(userActions.logIn());
  });

  const googleLogin = (googleToken: any) => {
    sendRequest("/auth/google/login", {}, googleToken.access_token);
  };

  const loginHandler = useGoogleLogin({
    onSuccess: googleLogin,
  });

  return (
    <div>
      {!isLoading && (
        <button onClick={() => loginHandler()}>
          <img alt="GoogleIcon" src={google_logo}></img>
          {"Sign In with Google"}
        </button>
      )}
      {isLoading && <LoadingSpinner pixelSize={44} />}
    </div>
  );
};
export default GoogleSignIn;
