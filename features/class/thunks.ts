import { GetClassesProps } from "@/lib/data/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getClasses = createAsyncThunk("class/getClasses", async (data: GetClassesProps, thunkAPI) => {
  const { startDate, day, locationId, coachId } = data;
  try {
    let query = `/api/class/classes?startDate=${startDate}&day=${day}`;

    if (locationId) {
      query = query.concat(`&locationId=${locationId}`);
    }
    if (coachId) {
      query = query.concat(`&coachId=${coachId}`);
    }
    const { data: classes } = await axios.get(query);

    return { classes, day };
  } catch (err) {
    thunkAPI.rejectWithValue(err);
  }
});
