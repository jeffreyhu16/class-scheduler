import { getCurrentDate, getStartOfWeek } from "@/lib/date";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToObjectOutput } from "luxon";

interface DateState {
  startOfWeek: ToObjectOutput;
  currentDate: ToObjectOutput;
}

const initialState: DateState = {
  startOfWeek: getStartOfWeek(),
  currentDate: getCurrentDate(),
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
  },
});

export const { setStartOfWeek, setCurrentDate } = dateSlice.actions;

export default dateSlice.reducer;
