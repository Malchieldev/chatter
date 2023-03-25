import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user-slice";
import chatsReducer from "./chats-slice";
import uiReducer from "./ui-slice";

type IActions = {
  type: "LOGOUT";
};

const combinedReducer = combineReducers({
  user: userReducer,
  chats: chatsReducer,
  ui: uiReducer,
});

const rootReducer = (state: any, action: IActions) => {
  if (action.type === "LOGOUT") {
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
