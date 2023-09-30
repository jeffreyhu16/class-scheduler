"use client"
import React, { useState } from "react";
import Calendar from "react-calendar";
import { DateTime } from "luxon";
import { useAppSelector } from "@/redux/store";
import { Value } from "react-calendar/dist/cjs/shared/types";
import { setCurrentDate, setStartOfWeek } from "@/features/date/slice";

export default function Sidebar() {
  const { presentDate, currentDate } = useAppSelector((state) => state.dates);
  const [selectDate, setSelectDate] = useState<Date>(new Date());

  const matchTile = (date: Date) => {
    const tileDate = DateTime.fromISO(date.toISOString());
    if (presentDate) {
      if (tileDate.equals(DateTime.fromObject(presentDate))) return "present-day-tile";
    }

    if (currentDate) {
      if (tileDate.equals(DateTime.fromObject(currentDate))) return "select-tile";
    }

    return "";
  };

  const handleChange = (date: Value) => {
    if (!date || Array.isArray(date)) return;

    setSelectDate(date as Date);
    const currentDate = DateTime.fromJSDate(date);
    setCurrentDate(currentDate.toObject());
    setStartOfWeek(currentDate.startOf("week").toObject());
  };

  return (
    <div className="sidebar">
      <Calendar
        value={selectDate}
        onChange={handleChange}
        defaultActiveStartDate={selectDate}
        tileClassName={({ date }) => matchTile(date)}
      />
      <ul className="side-list"></ul>
    </div>
  );
}
