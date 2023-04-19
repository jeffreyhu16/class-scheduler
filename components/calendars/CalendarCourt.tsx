"use client"
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
  const { data } = useAppSelector((state) => state.classes);

  let classCourtData: ClassI[] = [];
  if (day != undefined) {
    classCourtData = data.filter((data) => {
      return data.courtId === courtNum;
    });
  } else {
    classCourtData = data.filter((data) => {
      return data.location.name === location?.name && data.location.courtNo === courtNum;
    });
  }

  const calendarQuarterHours = [...Array(64)].map((k, i) => {
    return (
      <CalendarQuarterHour
        key={`quarter-hour-${i + 1}`}
        day={day}
        location={location}
        courtNum={courtNum}
        quarterHour={i + 1}
        classData={classCourtData}
      />
    );
  });

  const styles = {
    width: day ? `calc(100% / ${location?.courtCount})` : "calc(100% / 7)",
  };

  return (
    <div
      className={day ? `calendar-court court-${courtNum}` : `calendar-court ${location?.name}-${courtNum}`}
      style={styles}>
      {calendarQuarterHours}
    </div>
  );
}
