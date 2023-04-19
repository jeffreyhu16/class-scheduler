import { createAsyncThunk } from "@reduxjs/toolkit";

interface GetClassArgs {
  startDate: number;
  days?: number;
  locationId?: number;
  coachId?: number;
}

export const getClasses = createAsyncThunk("class/getClasses", async (data: GetClassArgs, thunkAPI) => {
  const { startDate, days, locationId, coachId } = data;
  try {
    const query =
      `/api/class/classes?startDate=${startDate}&locationId=${locationId}&coachId=${coachId}&days=${days}`;

    const res = await fetch(query);
    return await res.json();
  } catch (err) {
    thunkAPI.rejectWithValue(err);
  }
});
