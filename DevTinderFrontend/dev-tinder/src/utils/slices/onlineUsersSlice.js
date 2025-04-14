import { createSlice } from "@reduxjs/toolkit";

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: [],
  reducers: {
    addOnlineUsers: (state, action) => {
      return action.payload;
    },
    removeOnlineUsers: (state, action) => {
      return null;
    },
  },
});

export const { addOnlineUsers, removeOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
