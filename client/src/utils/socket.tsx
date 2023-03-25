import io from "socket.io-client";

const URL = `${process.env.REACT_APP_ROOT_SERVER_URL}:${process.env.REACT_APP_ROOT_SERVER_PORT}`;

export const socket = io(URL, {
  autoConnect: false,
});
