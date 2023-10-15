import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const initialState: GlowState = {
  day: [],
  location: {},
  quarterHour: [],
};

const glowSlice = createSlice({
  name: "glow",
  initialState,
  reducers: {
    setGlowState: (state, action: PayloadAction<SetGlowStateProps>) => {
      const { dayIndex, location, courtIndex, quarterHourIndex, isGlow } = action.payload;
      if (dayIndex) {
        state.day[dayIndex] = isGlow;
      }
      if (courtIndex && location) {
        if (!state.location[location]) {
          state.location[location] = [];
        }
        state.location[location][courtIndex] = isGlow;
      }
      state.quarterHour[quarterHourIndex] = isGlow;
    },
  },
});

export const { setGlowState } = glowSlice.actions;

export default glowSlice.reducer;
