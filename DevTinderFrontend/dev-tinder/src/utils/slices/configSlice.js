import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "config",
  initialState: {
    showSidebar: false,
  },
  reducers: {
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
  },
});

export default configSlice.reducer;
export const { setShowSidebar } = configSlice.actions;
