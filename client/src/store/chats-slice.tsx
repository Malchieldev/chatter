import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Chat = {
  id: string;
  recipient: { name: string; id: string; photo: string };
  lastMessage: { text: string; date: number };
};

const initialChatsState: { chats: Chat[] } = { chats: [] };

const sortChats = (chats: Chat[]) => {
  chats.sort((a, b) => {
    const firstDate = a.lastMessage?.date;
    const secondDate = b.lastMessage?.date;
    return secondDate - firstDate;
  });
};

const chatsSlice = createSlice({
  name: "chats",
  initialState: initialChatsState,
  reducers: {
    loadAndSort(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
      sortChats(state.chats);
    },
    updateAndSort(state, action: PayloadAction<Chat>) {
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === action.payload.id
      );
      chatIndex !== -1
        ? (state.chats[chatIndex].lastMessage = action.payload.lastMessage)
        : state.chats.push(action.payload);

      sortChats(state.chats);
    },
  },
});

export const chatsActions = chatsSlice.actions;
export default chatsSlice.reducer;