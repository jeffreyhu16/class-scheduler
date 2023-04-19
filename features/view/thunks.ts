import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCoaches = createAsyncThunk("coach/getCoaches", async (data, thunkAPI) => {
  try {
    const { data: coaches } = await axios.get("/api/coach/coaches");
    return coaches;
  } catch (err) {
    thunkAPI.rejectWithValue(err);
  }
});

export const getLocations = createAsyncThunk("location/getLocations", async (data, thunkAPI) => {
  try {
    const { data: locations } = await axios.get("/api/location/locations");
    return locations;
  } catch (err) {
    thunkAPI.rejectWithValue(err);
  }
});
