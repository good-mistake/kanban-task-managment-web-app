import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import boardReducer from "./boardSlice";
import taskReducer from "./taskSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "board",
  storage,
};
const persistedBoardReducer = persistReducer(persistConfig, boardReducer);
const presistedTaskReducer = persistReducer(persistConfig, taskReducer);

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    board: persistedBoardReducer,
    task: presistedTaskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
