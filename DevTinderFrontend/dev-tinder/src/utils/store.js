import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import feedReducer from "./slices/feedSlice";
import connectionsReducer from "./slices/connectionsSlice";
import requestsReducer from "./slices/requestsSlice";
import onlineUsersReducer from "./slices/onlineUsersSlice";
import unseenCountsReducer from "./slices/unseenCounts";
const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionsReducer,
    requests: requestsReducer,
    onlineUsers: onlineUsersReducer,
    unseenCounts: unseenCountsReducer,
  },
});

export default store;
