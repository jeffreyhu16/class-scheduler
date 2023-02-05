import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CalendarView = "day" | "week";

interface ViewState {
  calendarView: CalendarView;
  coach: { name: string };
  coachData?: any[];
  location: { name: string };
  locationData?: any[];
  coachAll: boolean;
  locationAll: boolean;
  printMode: boolean;
}

const initialState: ViewState = {
  calendarView: "week",
  coach: { name: "Larry" },
  location: { name: "all" },
  coachAll: false,
  locationAll: false,
  printMode: false,
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setCalendarView: (state, action: PayloadAction<CalendarView>) => {
      state.calendarView = action.payload;
    },
    setCoach: (state, action: PayloadAction<{ name: string }>) => {
      state.coach = action.payload;
    },
    setCoachData: (state, action: PayloadAction<any[]>) => {
      state.coachData = action.payload;
    },
    setLocation: (state, action: PayloadAction<{ name: string }>) => {
      state.location = action.payload;
    },
    setLocationData: (state, action: PayloadAction<any[]>) => {
      state.locationData = action.payload;
    },
    setPrintMode: (state, action: PayloadAction<boolean>) => {
      state.printMode = action.payload;
    },
  },
});

export const {
  setCalendarView,
  setCoach,
  setCoachData,
  setLocation,
  setLocationData,
  setPrintMode,
} = viewSlice.actions;

export default viewSlice.reducer;
