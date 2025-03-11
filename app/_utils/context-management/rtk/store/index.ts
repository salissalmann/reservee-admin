import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../features/storeSlice";
import { themeReducer } from "../features/theme-slice";
import { languageReducer } from "../features/language-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    language: languageReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
