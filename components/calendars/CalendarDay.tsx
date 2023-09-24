"use client";
import React from "react";
import CalendarCourt from "./CalendarCourt";
import CalendarQuarterHour from "./CalendarQuarterHour";
import { useAppSelector } from "@/redux/store";

export interface CalendarDayProps {
  day?: number;
}

export default function CalendarDay({ day = 0 }: CalendarDayProps) {
  const { calendarView, coach, location, locationData } = useAppSelector((state) => state.views);

  let calendarQuarterHours: JSX.Element[] = [];
  let calendarCourts: JSX.Element[] = [];

  if (locationData && calendarView === "day") {
    // Day view
    locationData.forEach((location) => {
      for (let j = location.courtCount; j > 0; j--) {
        calendarCourts.push(<CalendarCourt key={`${location.name}-${j}`} location={location} courtId={j} />);
      }
    });
  } else if (!coach && location) {
    // Week view expanded
    const { courtCount } = location;
    calendarCourts = [...Array(courtCount)].map((v, i) => (
      <CalendarCourt key={`${location.name}-${courtCount - i}`} day={day} courtId={courtCount - i} />
    ));
  } else if (coach) {
    // Week view
    calendarQuarterHours = [...Array(64)].map((v, i) => (
      <CalendarQuarterHour key={`quarter-hour-${i + 1}`} day={day} quarterHour={i + 1} />
    ));
  }

  const styles = {
    width: calendarView === "day" ? "100%" : "calc(100% / 7)",
    display: calendarView === "day" || !coach ? "flex" : "block",
    borderRight: calendarView !== "day" && !coach ? "1px solid rgb(201,255,227,0.4)" : "none",
  };

  return (
    <div className={`calendar-day day-${day}`} style={styles}>
      {calendarCourts.length ? calendarCourts : calendarQuarterHours}
    </div>
  );
}
