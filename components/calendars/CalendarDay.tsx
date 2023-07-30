"use client";
import React from "react";
import { DateTime } from "luxon";
import CalendarCourt from "./CalendarCourt";
import CalendarQuarterHour from "./CalendarQuarterHour";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { GetClassesProps } from "@/lib/data/types";
import { getClasses } from "@/features/class/thunks";

export interface CalendarDayProps {
  day?: number;
}

export default function CalendarDay({ day = 0 }: CalendarDayProps) {
  const { currentDate, startOfWeek } = useAppSelector((state) => state.dates);
  const dayClassData = useAppSelector((state) => state.classes.data[day]);
  const { calendarView, coach, location, locationData, glowState } = useAppSelector((state) => state.views);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    (async () => {
      let getClassesArgs = {} as GetClassesProps;

      if (startOfWeek && day && calendarView === "week") {
        getClassesArgs = {
          startDate: DateTime.fromObject(startOfWeek).toMillis(),
          days: day,
          coachId: coach?.id,
          locationId: location?.id,
        };
        dispatch(getClasses(getClassesArgs));
      }
      if (currentDate && calendarView === "day") {
        getClassesArgs = {
          startDate: DateTime.fromObject(currentDate).toMillis(),
          days: 0,
          coachId: coach?.id,
          locationId: location?.id,
        };
        dispatch(getClasses(getClassesArgs));
      }
    })();
  }, [calendarView, currentDate, startOfWeek, location, coach, day]);

  let calendarQuarterHours: JSX.Element[] = [];
  let calendarCourts: JSX.Element[] = [];

  if (locationData && calendarView === "day") {
    // Day view
    locationData.forEach((location) => {
      for (let j = location.courtCount; j > 0; j--) {
        calendarCourts.push(<CalendarCourt key={`${location.name}-${j}`} courtNum={j} />);
      }
    });
  } else if (!coach && location) {
    // Week view expanded
    const { courtCount } = location;
    calendarCourts = [...Array(courtCount)].map((v, i) => (
      <CalendarCourt key={`${location.name}-${courtCount - i}`} day={day} courtNum={courtCount - i} />
    ));
  } else if (coach && dayClassData) {
    // Week view
    calendarQuarterHours = [...Array(64)].map((v, i) => (
      <CalendarQuarterHour key={`quarter-hour-${i + 1}`} day={day} quarterHour={i + 1} classData={dayClassData} />
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
