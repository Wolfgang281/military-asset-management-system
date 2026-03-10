import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.userData = null;
      state.loading = false;
    },
  },
});

export const { setUserData, clearUser } = userSlice.actions;
export default userSlice.reducer;
