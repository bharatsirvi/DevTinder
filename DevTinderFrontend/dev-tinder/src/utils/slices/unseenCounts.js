import { createSlice } from "@reduxjs/toolkit";

const unseenCountsSlice = createSlice({
  name: "unseenCounts",
  initialState: {},
  reducers: {
    addUnseenCounts: (state, action) => action.payload,
    incrementUnseenCount: (state, action) => {
      const userId = action.payload;
      state[userId] = (state[userId] || 0) + 1;
    },
    resetUnseenCount: (state, action) => {
      delete state[action.payload];
    },
  },
});

export const { addUnseenCounts, resetUnseenCount, incrementUnseenCount } =
  unseenCountsSlice.actions;
export default unseenCountsSlice.reducer;
