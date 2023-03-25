import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialUiState = {
  activeChatId: "",
  activeProfile: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    toggleProfile(state, action: PayloadAction<string>) {
      state.activeProfile = action.payload;
    },
    toggleChat(state, action: PayloadAction<string>) {
      state.activeChatId = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
