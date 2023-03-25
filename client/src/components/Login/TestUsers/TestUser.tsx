import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { userActions } from "../../../store/user-slice";

import useFetch from "../../../hooks/use-fetch";

import LoadingSpinner from "../../../UI/LoadingSpinner";

import default_avatar_18 from "../../../assets/default_avatar_18.svg";

type TestUserProps = {
  id: string;
  name: string;
  photo: string;
};

const TestUser = (props: TestUserProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, , sendRequest] = useFetch("GET", (data: string) => {
    localStorage.setItem("token", data);
    dispatch(userActions.logIn());
  });

  const { id, name, photo } = props;
  const firstName = name.split(" ")[0];

  return (
    <li>
      <div>
        {!isLoading && (
          <button onClick={() => sendRequest("/auth/login", { id })}>
            <img alt="Avatar" src={photo || default_avatar_18}></img>
            {firstName}
          </button>
        )}
        {isLoading && <LoadingSpinner pixelSize={44} />}
      </div>
    </li>
  );
};

export default TestUser;
export type TestUserType = TestUserProps;
