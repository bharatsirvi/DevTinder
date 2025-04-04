import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeUserFormFeed: (state, action) => {
      const updatedFeed = state.filter(
        (user) => !(user._id === action.payload)
      );
      return updatedFeed;
    },
  },
});

export const { addFeed, removeUserFormFeed } = feedSlice.actions;
export default feedSlice.reducer;
