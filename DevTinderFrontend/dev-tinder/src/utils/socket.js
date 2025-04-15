import { BACKEND_BASE_URL } from "./constants";

import io from "socket.io-client";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(BACKEND_BASE_URL);
  } else {
    return io("/", {
      path: "/api/socket.io",
    });
  }
};
