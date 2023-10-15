import { CoachI, LocationI } from "@/lib/data/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCoaches, getLocations } from "./thunks";

export type CalendarView = "day" | "week";

export type ListItem = { name: string };

export interface BreakPointI {
  [breakpoint: number]: boolean;
}

interface ViewState {
  calendarView: CalendarView;
  coach?: CoachI | null;
  coachData?: CoachI[];
  location?: LocationI | null;
  locationData?: LocationI[];
  breakPoint: BreakPointI;
  printMode: boolean;
}

const initialState: ViewState = {
  calendarView: "week",
  breakPoint: {},
  printMode: false,
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setCalendarView: (state, action: PayloadAction<CalendarView>) => {
      state.calendarView = action.payload;
    },
    setCoach: (state, action: PayloadAction<CoachI | null>) => {
      state.coach = action.payload;
    },
    setCoachData: (state, action: PayloadAction<CoachI[]>) => {
      state.coachData = action.payload;
    },
    setLocation: (state, action: PayloadAction<LocationI | null>) => {
      state.location = action.payload;
    },
    setLocationData: (state, action: PayloadAction<LocationI[]>) => {
      state.locationData = action.payload;
    },
    setBreakPoint: (state, action: PayloadAction<BreakPointI>) => {
      state.breakPoint = action.payload;
    },
    setPrintMode: (state, action: PayloadAction<boolean>) => {
      state.printMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoaches.fulfilled, (state, { payload }) => {
        state.coachData = payload;
        if (payload?.length) {
          state.coach = payload[0];
        }
      })
      .addCase(getLocations.fulfilled, (state, { payload }) => {
        state.locationData = payload;
        if (payload?.length) {
          state.location = payload[0];
          // payload.forEach((location: LocationI) => {
          //   state.glowState.location[location.key] = [];
          // });
        }
      });
  },
});

export const {
  setCalendarView,
  setCoach,
  setCoachData,
  setLocation,
  setLocationData,
  setBreakPoint,
  setPrintMode,
} = viewSlice.actions;

export default viewSlice.reducer;
