"use client";
import React from "react";
import Calendar from "./calendars/Calendar";
import Sidebar from "./Sidebar";
import { useAppSelector } from "@/redux/store";

export default function Main() {
  const { appState } = useAppSelector((state) => state.classes);
  const { calendarView, coach, breakPoint } = useAppSelector((state) => state.views);

  const styles = {
    display: appState === "complete" ? "flex" : "hidden",
  };

  return (
    <main className="main" style={styles}>
      {(calendarView === "day" || !!coach) && breakPoint[1280] && <Sidebar />}
      <Calendar />
    </main>
  );
}
