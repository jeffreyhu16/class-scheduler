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
  const { data } = useAppSelector((state) => state.classes);
  const { calendarView, coach, location, locationData, glowState } = useAppSelector((state) => state.views);

  const classData = useAppSelector((state) => state.classes.data[day]);
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

  if (!data.length) return null;

  let calendarQuarterHours: JSX.Element[] = [];
  let calendarCourts: JSX.Element[] = [];

  if (locationData && calendarView === "day") {
    locationData.forEach((location) => {
      for (let j = location.courtCount; j > 0; j--) {
        calendarCourts.push(<CalendarCourt location={location} courtNum={j} />);
      }
    });
  } else if (!coach && location) {
    let j = location.courtCount;
    calendarCourts = [...Array(j)].map(() => (
      <CalendarCourt key={`${location.name}-${j}`} day={day} courtNum={j--} location={location} />
    ));
  } else if (coach && classData) {
    calendarQuarterHours = [...Array(64)].map((k, i) => (
      <CalendarQuarterHour key={`quarter-hour-${i + 1}`} day={day} quarterHour={i + 1} classData={classData} />
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
