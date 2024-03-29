import { useState } from "react";
import ClassForm from "../ClassForm";
import { ClassType } from "@prisma/client";
import { ClassI } from "@/lib/data/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setGlowState } from "@/features/glow/slice";
import { useClasses } from "@/hooks/swr";
import { DateTime } from "luxon";

export interface CalendarQuarterHourProps {
  day?: number;
  locationId?: string;
  courtId?: number;
  quarterHour: number;
}

export default function CalendarQuarterHour({ day = 0, courtId, locationId, quarterHour }: CalendarQuarterHourProps) {
  const { currentDate, startOfWeek } = useAppSelector((state) => state.dates);
  const { calendarView, coach, location, printMode } = useAppSelector((state) => state.views);

  const { classData, isLoading, error, refetch } = useClasses({
    startDate: calendarView === "week" ? startOfWeek : currentDate,
    day,
    coachId: coach?.id,
    locationId: locationId ?? location?.id,
    courtId,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const dispatch = useAppDispatch();

  if (isLoading || error) return <></>;

  let startTimeTarget: ClassI[] = [];
  let midTimeTarget: ClassI[] = [];
  let endTimeTarget: ClassI[] = [];
  let isBreak = false;

  let isStartTime, isMidTime, isEndTime, duration, showLocation;
  if (classData.length > 0) {
    // filter startTime //
    startTimeTarget = classData.filter((dayTarget: ClassI) => {
      const startDateTime = DateTime.fromMillis(dayTarget.startTime, { zone: "utc" });
      const quarterInterval = startDateTime.minute / 15;
      const startTimeQuarterHour = (startDateTime.hour - 7) * 4 + quarterInterval;
      return startTimeQuarterHour === quarterHour - 1;
    });

    isStartTime = startTimeTarget.length ? true : false;

    // filter midTime //
    midTimeTarget = classData.filter((dayTarget: ClassI) => {
      const startDateTime = DateTime.fromMillis(dayTarget.startTime, { zone: "utc" });
      const endDateTime = DateTime.fromMillis(dayTarget.endTime, { zone: "utc" });
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
    endTimeTarget = classData.filter((dayTarget: ClassI) => {
      const endDateTime = DateTime.fromMillis(dayTarget.endTime, { zone: "utc" });
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
    startString = DateTime.fromMillis(startTime, { zone: "utc" }).toFormat("h:mm");
    endString = DateTime.fromMillis(endTime, { zone: "utc" }).toFormat("h:mm");

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

  if (classTimeTarget) isBreak = classTimeTarget.isBreak;

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

  if (isBreak || classTimeTarget?.type === ClassType.BLOCK) {
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
      fontSize: printMode ? "1.25rem" : calendarView === "week" && coach == null ? "0.875rem" : "1rem",
    },
    classInfoDetails: {
      marginBottom: calendarView === "week" && coach == null ? "0.25rem" : "0.5rem",
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
              courtIndex: courtId,
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
              courtIndex: courtId,
              quarterHourIndex: quarterHour,
              isGlow: false,
            })
          );
        }}
        className={
          calendarView === "week"
            ? `calendar-quarter-hour day-${day} quarter-hour-${quarterHour}`
            : `calendar-quarter-hour ${location?.name}-${courtId} quarter-hour-${quarterHour}`
        }
        onClick={() => setIsFormOpen((prev) => !prev)}
        style={styles.container}>
        {isStartTime && (
          <div className="calendar-class-info" style={styles.classInfo}>
            {classTimeObj && coach === null && (
              <div className="calendar-class-info-details" style={styles.classInfoDetails}>
                {classTimeObj.coach.name}
              </div>
            )}
            <div
              className="calendar-class-info-details"
              style={styles.classInfoDetails}>{`${startString}-${endString}`}</div>
            <div className="calendar-class-info-details" style={styles.classInfoDetails}>
              {classTimeObj && showLocation && classTimeObj.location.name}
            </div>
            <div className="calendar-class-info-details" style={styles.classInfoDetails}>
              {classTimeObj?.type === ClassType.BLOCK ? classTimeObj.note : studentNames}
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <ClassForm
          day={day}
          quarterHour={quarterHour}
          toggleForm={() => setIsFormOpen((prev) => !prev)}
          classTimeTarget={classTimeTarget}
          refetch={refetch}
        />
      )}

      {isFormOpen && <div className="overlay"></div>}
    </>
  );
}
