//create a slice for language
import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
    name: "language",
    initialState: {
        language: "de",
    },
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
        }
    }
});

export const { setLanguage } = languageSlice.actions;

export const languageReducer = languageSlice.reducer;