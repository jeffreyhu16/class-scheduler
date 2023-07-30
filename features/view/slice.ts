import { CoachI, LocationI } from "@/lib/data/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCoaches, getLocations } from "./thunks";

export type CalendarView = "day" | "week";

export type ListItem = { name: string };
export type CoachItem = ListItem | CoachI;
export type LocationItem = ListItem | LocationI;

export interface BreakPointI {
  [breakpoint: number]: boolean;
}

export interface GlowState {
  day: boolean[];
  location: { [key: string]: boolean[] };
  quarterHour: boolean[];
}

export interface SetGlowStateProps {
  dayIndex?: number;
  location?: string;
  courtIndex?: number;
  quarterHourIndex: number;
  isGlow: boolean;
}

interface ViewState {
  calendarView: CalendarView;
  coach?: CoachI;
  coachData?: CoachI[];
  location?: LocationI;
  locationData?: LocationI[];
  breakPoint: BreakPointI;
  printMode: boolean;
  glowState: GlowState;
}

const initialState: ViewState = {
  calendarView: "week",
  coach: undefined,
  location: undefined,
  // breakPoint: {
  //   1280: window.innerWidth > 1280,
  //   780: window.innerWidth > 780,
  //   660: window.innerWidth > 660,
  // },
  breakPoint: {},
  printMode: false,
  glowState: {
    day: [],
    location: {},
    quarterHour: [],
  },
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setCalendarView: (state, action: PayloadAction<CalendarView>) => {
      state.calendarView = action.payload;
    },
    setCoach: (state, action: PayloadAction<CoachI | undefined>) => {
      state.coach = action.payload;
    },
    setCoachData: (state, action: PayloadAction<CoachI[]>) => {
      state.coachData = action.payload;
    },
    setLocation: (state, action: PayloadAction<LocationI | undefined>) => {
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
    setGlowState: (state, action: PayloadAction<SetGlowStateProps>) => {
      const { dayIndex, location, courtIndex, quarterHourIndex, isGlow } = action.payload;
      if (dayIndex) {
        state.glowState.day[dayIndex] = isGlow;
      }
      if (courtIndex && location) {
        state.glowState.location[location][courtIndex] = isGlow;
      }
      state.glowState.quarterHour[quarterHourIndex] = isGlow;
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
          payload.forEach((location: LocationI) => {
            state.glowState.location[location.key] = [];
          });
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
  setGlowState,
} = viewSlice.actions;

export default viewSlice.reducer;
