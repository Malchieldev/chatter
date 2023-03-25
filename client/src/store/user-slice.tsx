import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialUserState = {
  id: "",
  name: "",
  photo: "",
  isAuthenticated: false,
  dataLoaded: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    logIn(state) {
      state.isAuthenticated = true;
    },
    logOut(state) {
      state.id = "";
      state.name = "";
      state.photo = "";
      state.isAuthenticated = false;
      state.dataLoaded = false;
    },
    updateData(state, action: PayloadAction<typeof initialUserState>) {
      const { id, name, photo } = action.payload;
      state.id = id;
      state.name = name;
      state.photo = photo;
      state.dataLoaded = true;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
