import { createAsyncThunk } from "@reduxjs/toolkit";

interface GetClassArgs {
  date: string;
  day?: number;
  location: string;
  coach: string;
}

export const getClasses = createAsyncThunk(
  "class/getStartOfWeekClasses",
  async (data: GetClassArgs, thunkAPI) => {
    const { date, day, location, coach } = data;
    try {
      const query =
        "/api/class/classes" +
        `?startOfWeek=${date}` +
        `&location=${location}` +
        `&coach=${coach}` +
        day
          ? `&day=${day}`
          : "";

      const res = await fetch(query);
      return await res.json();
    } catch (err) {
      thunkAPI.rejectWithValue(err);
    }
  }
);
