"use client";
import { useState } from "react";
import ClassForm from "../ClassForm";
import { DateTime } from "luxon";
import { ClassI, LocationI } from "@/lib/data/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setGlowState } from "@/features/view/slice";

export interface CalendarQuarterHourProps {
  day?: number;
  location?: LocationI;
  courtNum?: number;
  quarterHour: number;
  classData: ClassI[];
}

export default function CalendarQuarterHour({
  day = 0,
  location,
  courtNum,
  quarterHour,
  classData,
}: CalendarQuarterHourProps) {
  const { calendarView, coach, printMode } = useAppSelector((state) => state.views);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const dispatch = useAppDispatch();

  let startTimeTarget: ClassI[] = [];
  let midTimeTarget: ClassI[] = [];
  let endTimeTarget: ClassI[] = [];
  let isLeave = false;

  let isStartTime, isMidTime, isEndTime, duration, showLocation;
  if (classData.length > 0) {
    // filter startTime //
    startTimeTarget = classData.filter((dayTarget) => {
      const startDateTime = DateTime.fromMillis(dayTarget.startTime);
      const quarterInterval = startDateTime.minute / 15;
      const startTimeQuarterHour = (startDateTime.hour - 7) * 4 + quarterInterval;
      return startTimeQuarterHour === quarterHour - 1;
    });

    isStartTime = startTimeTarget.length ? true : false;

    // filter midTime //
    midTimeTarget = classData.filter((dayTarget) => {
      const startDateTime = DateTime.fromMillis(dayTarget.startTime);
      const endDateTime = DateTime.fromMillis(dayTarget.endTime);
      const quarterInterval = startDateTime.minute / 15;
      const startTimeQuarterHour = (startDateTime.hour - 7) * 4 + quarterInterval;

      duration = endDateTime.diff(startDateTime, "minutes").toObject().minutes || 0;

      let isMidTime = false;
      if (duration > 30) {
        const midTimeQuarterHours = (duration - 30) / 15;
        for (let i = 1; i <= midTimeQuarterHours; i++) {
          if (startTimeQuarterHour + i === quarterHour - 1) {
            isMidTime = true;
          }
        }
        if (startTimeQuarterHour === quarterHour - 1) showLocation = true;
      }
      return isMidTime;
    });

    isMidTime = midTimeTarget.length ? true : false;

    // filter endTime //
    endTimeTarget = classData.filter((dayTarget) => {
      const endDateTime = DateTime.fromMillis(dayTarget.endTime);
      const quarterInterval = endDateTime.minute / 15;
      const endTimeQuarterHour = (endDateTime.hour - 7) * 4 + quarterInterval;
      return endTimeQuarterHour === quarterHour;
    });

    isEndTime = endTimeTarget.length ? true : false;
  }

  let classTimeObj: ClassI | undefined;
  let startString;
  let endString;
  let studentNames = "";

  if (isStartTime) {
    classTimeObj = startTimeTarget[0];
    const { startTime, endTime, students } = classTimeObj;
    startString = DateTime.fromMillis(startTime).toFormat("h:mm");
    endString = DateTime.fromMillis(endTime).toFormat("h:mm");

    students.forEach((student) => {
      studentNames += student.name + " ";
    });
  }

  const classTimeTarget = isStartTime
    ? startTimeTarget[0]
    : isMidTime
    ? midTimeTarget[0]
    : isEndTime
    ? endTimeTarget[0]
    : undefined;

  if (classTimeTarget) isLeave = classTimeTarget.isLeave;

  let isFree = true;
  if (isStartTime || isMidTime || isEndTime) isFree = false;

  const borderDefault = "1px solid rgba(201, 229, 255, 0.2)";
  const borderActive = "1px solid #00407b";

  let backgroundColor, borderTop, borderBottom;
  if (isStartTime) {
    borderTop = borderActive;
  } else if (isMidTime) {
    borderTop = "";
    borderBottom = "";
  } else if (isEndTime) {
    borderBottom = borderActive;
  } else {
    borderTop = borderDefault;
    borderBottom = borderDefault;
  }

  if (isLeave || (isLeave && isHover)) {
    backgroundColor = "rgba(201,229,255,0.5)";
  } else if (!isFree || isHover) {
    backgroundColor = "#c9e5ff";
  } else {
    backgroundColor = "#00407b";
  }

  const styles = {
    container: {
      backgroundColor: backgroundColor,
      borderTop: borderTop,
      borderBottom: borderBottom,
      borderLeft: isFree ? borderDefault : borderActive,
      borderRight: isFree ? borderDefault : borderActive,
    },
    classInfo: {
      top: printMode ? "0.1em" : "0.5em",
      fontSize: printMode ? "1.25rem" : "1rem",
    },
  };

  return (
    <>
      <div
        onMouseEnter={() => {
          setIsHover(true);
          dispatch(
            setGlowState({
              dayIndex: day,
              location: location?.key,
              courtIndex: courtNum,
              quarterHourIndex: quarterHour,
              isGlow: true,
            })
          );
        }}
        onMouseLeave={() => {
          setIsHover(false);
          dispatch(
            setGlowState({
              dayIndex: day,
              location: location?.key,
              courtIndex: courtNum,
              quarterHourIndex: quarterHour,
              isGlow: false,
            })
          );
        }}
        className={
          calendarView === "week"
            ? `calendar-quarter-hour day-${day} quarter-hour-${quarterHour}`
            : `calendar-quarter-hour ${location?.name}-${courtNum} quarter-hour-${quarterHour}`
        }
        onClick={() => setIsFormOpen((prev) => !prev)}
        style={styles.container}>
        {isStartTime && (
          <div className="calendar-class-info" style={styles.classInfo}>
            {classTimeObj && !coach && <div className="calendar-class-info-coach-name">{classTimeObj.coach.name}</div>}
            <div className="calendar-class-info-class-period">{`${startString}-${endString}`}</div>
            <div className="calendar-class-info-location">
              {classTimeObj && showLocation && classTimeObj.location.name}
            </div>
            <div className="calendar-class-info-student-name">{classTimeObj && studentNames}</div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <ClassForm
          day={day}
          quarterHour={quarterHour}
          toggleForm={() => setIsFormOpen((prev) => !prev)}
          classTimeTarget={classTimeTarget}
        />
      )}

      {isFormOpen && <div className="overlay"></div>}
    </>
  );
}
