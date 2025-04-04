import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: [],
  reducers: {
    addRequests: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      const updatedRequestsList = state.filter(
        (req) => !(req._id === action.payload)
      );
      return updatedRequestsList;
    },
  },
});

export default requestsSlice.reducer;
export const { addRequests, removeRequest } = requestsSlice.actions;
