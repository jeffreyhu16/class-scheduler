"use client";
import React from "react";
import Calendar from "react-calendar";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Value } from "react-calendar/dist/cjs/shared/types";
import { setCurrentDate, setStartOfWeek } from "@/features/date/slice";
import { DateTime } from "luxon";

export default function Sidebar() {
  const { currentDate } = useAppSelector((state) => state.dates);
  const dispatch = useAppDispatch();

  const matchTile = (date: Date) => {
    const tileDate = DateTime.fromJSDate(date);
    const presentDay = DateTime.local();

    if (tileDate.month === presentDay.month && tileDate.day === presentDay.day) {
      return "present-day-tile";
    }

    if (tileDate.month === currentDate.month && tileDate.day === currentDate.day) {
      return "select-tile";
    }

    return "";
  };

  const handleChange = (date: Value) => {
    if (!date || Array.isArray(date)) return;

    const currentDate = DateTime.fromJSDate(date);
    dispatch(setCurrentDate(currentDate.toObject()));
    dispatch(setStartOfWeek(currentDate.startOf("week").toObject()));
  };

  return (
    <div className="sidebar">
      <Calendar
        value={DateTime.fromObject(currentDate).toJSDate()}
        onChange={handleChange}
        activeStartDate={DateTime.fromObject(currentDate).toJSDate()}
        tileClassName={({ date }) => matchTile(date)}
      />
      <ul className="side-list"></ul>
    </div>
  );
}
