"use client";
import React from "react";
import CalendarQuarterHour from "./CalendarQuarterHour";
import { ClassI, LocationI } from "@/lib/data/types";
import { useAppSelector } from "@/redux/store";

export interface CalendarCourtProps {
  courtNum: number;
  location?: LocationI;
  day?: number;
}

export default function CalendarCourt({ location, courtNum, day }: CalendarCourtProps) {
  const { data: classData } = useAppSelector((state) => state.classes);

  let classCourtData: ClassI[] = [];
  if (day != undefined) {
    classCourtData = classData[day]?.filter((c) => {
      return c.courtId === courtNum;
    });
  } else {
    classCourtData = classData[0]?.filter((c) => {
      return c.location.name === location?.name && c.courtId === courtNum;
    });
  }

  const styles = {
    width: day ? `calc(100% / ${location?.courtCount})` : "calc(100% / 7)",
  };

  return (
    <div
      className={day ? `calendar-court court-${courtNum}` : `calendar-court ${location?.name}-${courtNum}`}
      style={styles}>
      {[...Array(64)].map((k, i) => (
        <CalendarQuarterHour
          key={`quarter-hour-${i + 1}`}
          day={day}
          location={location}
          courtNum={courtNum}
          quarterHour={i + 1}
          classData={classCourtData}
        />
      ))}
    </div>
  );
}
