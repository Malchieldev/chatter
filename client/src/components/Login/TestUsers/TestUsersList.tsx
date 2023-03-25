import { useState, useEffect, useCallback } from "react";

import LoadingSpinner from "../../../UI/LoadingSpinner";
import TestUser from "./TestUser";
import type { TestUserType } from "./TestUser";

import useFetch from "../../../hooks/use-fetch";

const TestUsersList = () => {
  const [testUsers, setTestUsers] = useState<TestUserType[]>([]);
  const onSuccessHandler = useCallback((data: any) => setTestUsers(data), []);
  const onErrorHandler = useCallback(() => setTestUsers([]), []);

  const [isLoading, error, sendRequest] = useFetch(
    "GET",
    onSuccessHandler,
    onErrorHandler
  );

  useEffect(() => {
    sendRequest("/auth/test-users");
  }, [sendRequest]);

  return (
    <>
      {!isLoading && !error && (
        <ul>
          {testUsers.map((user) => (
            <TestUser
              key={user.id}
              id={user.id}
              name={user.name}
              photo={user.photo}
            />
          ))}
        </ul>
      )}
      {!isLoading && error}
      {isLoading && <LoadingSpinner pixelSize={80} />}
    </>
  );
};

export default TestUsersList;
