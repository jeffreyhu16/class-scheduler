"use client"
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { getCurrentDate, getStartOfWeek } from "@/lib/date";
import { setStartOfWeek, setCurrentDate } from "@/features/date/slice";
import { setBreakPoint } from "@/features/view/slice";
import { getCoaches, getLocations } from "@/features/view/thunks";
import { Backdrop, CircularProgress } from "@mui/material";
import { store, useAppDispatch, useAppSelector } from "@/redux/store";
import Header from "./Header";
import Main from "./Main";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { appState } = useAppSelector((state) => state.classes);

  useEffect(() => {
    const startOfWeek = getStartOfWeek();
    const currentDate = getCurrentDate();
    dispatch(setStartOfWeek(startOfWeek));
    dispatch(setCurrentDate(currentDate));
    dispatch(getCoaches())
    dispatch(getLocations())

    const windowResizeHandler = () => {
      dispatch(
        setBreakPoint({
          1280: window.innerWidth > 1280,
          780: window.innerWidth > 780,
          660: window.innerWidth > 660,
        })
      );
    };

    window.addEventListener("resize", windowResizeHandler);

    return () => window.removeEventListener("resize", windowResizeHandler);
  }, []);

  return (
    <Provider store={store}>
      <Header />
      <Main />

      <Backdrop open={appState === "init" || appState === "loading"}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Provider>
  );
}
