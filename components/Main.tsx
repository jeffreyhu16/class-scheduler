"use client";
import React from "react";
import Calendar from "./calendars/Calendar";
import Sidebar from "./Sidebar";
import { useAppSelector } from "@/redux/store";

export default function Main() {
  const { appState } = useAppSelector((state) => state.classes);
  const { calendarView, coach, location, printMode } = useAppSelector((state) => state.views);

  const wideView = calendarView === "week" && coach === null;

  return (
    <main className="main">
      {!wideView && <Sidebar />}
      <Calendar />
    </main>
  );
}
