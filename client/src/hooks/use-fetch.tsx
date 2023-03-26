import { useState, useCallback } from "react";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";

const url = `${process.env.REACT_APP_ROOT_SERVER_URL}:${process.env.REACT_APP_ROOT_SERVER_PORT}/api/v1`;
const headers = {
  "Content-Type": "application/json",
};

export default function useFetch(
  method = "GET",
  onSuccess?: Function,
  onError?: Function
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  const sendRequest = useCallback(
    (api: string, { ...params } = {}, googleToken?: string) => {
      setIsLoading(true);
      const token = googleToken || localStorage.getItem("token");
      if (token) {
        Object.assign(headers, { Authorization: `Bearer ${token}` });
      }

      const reqParams = {
        method: method.toUpperCase(),
        headers: headers,
      };

      let urlParams = "";

      if (method === "GET") {
        urlParams = `?${new URLSearchParams(params)}`;
      } else {
        Object.assign(reqParams, { body: JSON.stringify(params) });
      }

      fetch(`${url}${api}${urlParams}`, reqParams)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText, { cause: response.status });
          }
          return response.json();
        })
        .then((data: {}) => {

          if (onSuccess) {
            onSuccess(data);
          }
        })
        .catch((err) => {
          if (err.cause === 401) {
            localStorage.removeItem("token");
            dispatch({ type: "LOGOUT" });
          }
          setError(err.message);

          if (onError) {
            onError(err.cause);
          }
        })
        .finally(() => setIsLoading(false));
    },
    [dispatch, method, onError, onSuccess]
  );

  return [isLoading, error, sendRequest, setIsLoading] as const;
}
