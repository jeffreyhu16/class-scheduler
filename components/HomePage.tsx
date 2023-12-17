"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { setBreakPoint } from "@/features/view/slice";
import { getCoaches, getLocations } from "@/features/view/thunks";
import { Backdrop, CircularProgress } from "@mui/material";
import { store, useAppDispatch } from "@/redux/store";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Header from "./Header";
import Main from "./Main";

const HomePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCoaches());
    dispatch(getLocations());

    const windowResizeHandler = () => {
      dispatch(
        setBreakPoint({
          1280: window.innerWidth > 1280,
          780: window.innerWidth > 780,
          660: window.innerWidth > 660,
        })
      );
    };

    windowResizeHandler();

    window.addEventListener("resize", windowResizeHandler);

    return () => window.removeEventListener("resize", windowResizeHandler);
  }, []);

  return (
    <Provider store={store}>
      <Header />
      <Main />

      <Backdrop open={false}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Provider>
  );
};

export default withPageAuthRequired(HomePage);
