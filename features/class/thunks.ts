import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface GetClassArgs {
  startDate: number;
  days: number;
  locationId?: number;
  coachId?: number;
}

export const getClasses = createAsyncThunk("class/getClasses", async (data: GetClassArgs, thunkAPI) => {
  const { startDate, days, locationId, coachId } = data;
  try {
    let query = `/api/class/classes?startDate=${startDate}&days=${days}`;

    if (locationId) {
      query = query.concat(`&locationId=${locationId}`);
    }
    if (coachId) {
      query = query.concat(`&coachId=${coachId}`);
    }
    const { data: classes } = await axios.get(query);
    console.log('classes:', classes)
    return classes;
  } catch (err) {
    thunkAPI.rejectWithValue(err);
  }
});
