"use client";
import React from "react";
import CalendarQuarterHour from "./CalendarQuarterHour";
import { ClassI, LocationI } from "@/lib/data/types";
import { useAppSelector } from "@/redux/store";

export interface CalendarCourtProps {
  courtNum: number;
  day?: number;
}

export default function CalendarCourt({ courtNum, day = 0 }: CalendarCourtProps) {
  const dayClassData = useAppSelector((state) => state.classes.data[day]);
  const { calendarView, location } = useAppSelector((state) => state.views);

  const courtClassData: ClassI[] | undefined =
    calendarView === "week"
      ? dayClassData?.filter((c) => c.courtId === courtNum)
      : dayClassData?.filter((c) => c.location.name === location?.name && c.courtId === courtNum);

  const styles = {
    width: day ? `calc(100% / ${location?.courtCount})` : "calc(100% / 7)",
  };

  return (
    <div
      className={day ? `calendar-court court-${courtNum}` : `calendar-court ${location?.name}-${courtNum}`}
      style={styles}>
      {courtClassData &&
        [...Array(64)].map((k, i) => (
          <CalendarQuarterHour
            key={`quarter-hour-${i + 1}`}
            day={day}
            location={location}
            courtNum={courtNum}
            quarterHour={i + 1}
            classData={courtClassData}
          />
        ))}
    </div>
  );
}
