import { ClassI } from "@/lib/data/types";
import { createSlice } from "@reduxjs/toolkit";
import { getClasses } from "./thunks";

interface ClassState {
  appState: "init" | "loading" | "complete" | "error";
  data: ClassI[][];
  fetchError?: string;
}

const initialState: ClassState = {
  appState: "init",
  data: [],
  fetchError: undefined,
};

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClasses.pending, (state) => {
        state.appState = "loading";
      })
      .addCase(getClasses.fulfilled, (state, { payload }) => {
        state.appState = "complete";
        if (payload?.day != undefined) {
          state.data[payload.day] = payload?.classes;
        }
      })
      .addCase(getClasses.rejected, (state, { payload }) => {
        state.appState = "error";
        state.fetchError = payload as string;
      });
  },
});

export default classSlice.reducer;
