import { ClassI } from "@/lib/data/types";
import { createSlice } from "@reduxjs/toolkit";

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
});

export default classSlice.reducer;
