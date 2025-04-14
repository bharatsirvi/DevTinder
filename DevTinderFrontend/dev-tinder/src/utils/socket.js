import { BACKEND_BASE_URL } from "./constants";

import io from "socket.io-client";

export const createSocketConnection = () => {
  return io(BACKEND_BASE_URL, {
    path: "/socket.io",
    withCredentials: true,
  });
};
