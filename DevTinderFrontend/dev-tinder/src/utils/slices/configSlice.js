import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "config",
  initialState: {
    showSidebar: false,
    initialSetup: false,
  },
  reducers: {
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    setInitialSetup: (state, action) => {
      state.initialSetup = action.payload;
    },
  },
});

export default configSlice.reducer;
export const { setShowSidebar, setInitialSetup } = configSlice.actions;
