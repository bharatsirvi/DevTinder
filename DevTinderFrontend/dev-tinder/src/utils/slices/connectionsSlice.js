import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: [],
  reducers: {
    addConnections: (state, action) => {
      return action.payload;
    },
    addConnection: (state, action) => {
      state.push(action.payload);
    },
    removeConnections: (state, action) => null,
  },
});

export default connectionsSlice.reducer;
export const { addConnections, addConnection, removeConnections } =
  connectionsSlice.actions;
