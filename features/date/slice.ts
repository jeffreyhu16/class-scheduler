import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToObjectOutput } from "luxon";

interface DateState {
  startOfWeek?: ToObjectOutput;
  currentDate?: ToObjectOutput;
  presentDate?: ToObjectOutput;
}

const initialState: DateState = {
  startOfWeek: undefined,
  currentDate: undefined,
  presentDate: undefined,
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setStartOfWeek: (state, action: PayloadAction<ToObjectOutput>) => {
      state.startOfWeek = action.payload;
    },
    setCurrentDate: (state, action: PayloadAction<ToObjectOutput>) => {
      state.currentDate = action.payload;
    },
    setPresentDate: (state, action: PayloadAction<ToObjectOutput>) => {
      state.presentDate = action.payload;
    },
  },
});

export const { setStartOfWeek, setCurrentDate, setPresentDate } = dateSlice.actions;

export default dateSlice.reducer;
