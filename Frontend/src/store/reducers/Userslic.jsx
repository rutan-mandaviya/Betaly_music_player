import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};
const UsersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    Loaduser: (state, action) => {
      state.user = action.payload;
    },
    removeuser: (state, action) => {
      state.user = null;
    },
  },
});

export default UsersSlice.reducer;
export const { Loaduser, removeuser } = UsersSlice.actions;
