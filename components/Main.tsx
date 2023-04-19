"use client"
import React from "react";
import Calendar from "./calendars/Calendar";
import Sidebar from "./Sidebar";
import { useAppSelector } from "@/redux/store";

export default function Main() {
  const { calendarView, coach, breakPoint } = useAppSelector((state) => state.views);

  return (
    <main className="main-flex">
      {(calendarView === "day" || !!coach) && breakPoint[1280] && <Sidebar />}
      <Calendar />
    </main>
  );
}
