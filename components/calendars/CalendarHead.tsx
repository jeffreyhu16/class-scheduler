"use client"
import React, { CSSProperties, useEffect, useState } from "react";
import { DateTime, Settings, ToObjectOutput } from "luxon";
import { useAppSelector } from "@/redux/store";
import { LocationI } from "@/lib/data/types";
import { getFullWeek } from "@/lib/date";

export interface CalendarHeadCourtProps {
  day?: number;
  location: LocationI;
}

export default function CalendarHead() {
  const { currentDate, startOfWeek } = useAppSelector((state) => state.dates);
  const { calendarView, coach, location, locationData, glowState } = useAppSelector((state) => state.views);
  const [weekData, setWeekData] = useState<{ [key: string]: ToObjectOutput }>();

  let i = 0;
  let weekDataArr;
  let calendarHeads = [];

  useEffect(() => {
    if (startOfWeek) {
      const startOfWeekJS = DateTime.fromObject(startOfWeek).toJSDate();
      const weekData = getFullWeek(startOfWeekJS);
      setWeekData(weekData);
    }
  }, [startOfWeek]);

  function CalendarHeadCourt({ day, location }: CalendarHeadCourtProps) {
    const { name, courtCount } = location;
    const dayCourtHeads = [...Array(location.courtCount)].map((k, i) => {
      const weekStyles: CSSProperties = {
        opacity: day && glowState.day[day] && glowState.location[name][courtCount] ? "1" : "0",
        width: `calc(100% / ${courtCount})`,
        marginBottom: "0.3em",
      };
      const dayStyles: CSSProperties = {
        textShadow: glowState.location[name][courtCount] ? "0 0 0.5rem #fff" : "none",
        width: `calc(100% / 7)`, // change logic when new courts added //
        marginBottom: "0.8em",
      };

      return (
        <div
          key={`${name}-${courtCount - i}`}
          className="calendar-head-court"
          style={calendarView === "week" ? weekStyles : dayStyles}>
          <div className="calendar-head-court-name">{calendarView !== "week" && location.name}</div>
          <div>{calendarView === "week" ? `Court ${courtCount - i}` : `# ${courtCount - i}`}</div>
        </div>
      );
    });
    return <>{dayCourtHeads}</>;
  }

  if (currentDate && locationData && calendarView !== "week") {
    for (let i = 1; i < locationData.length; i++) {
      calendarHeads.push(<CalendarHeadCourt location={locationData[i]} />);
    }
  }

  return (
    <>
      {calendarView === "week"
        ? weekData &&
          location &&
          calendarView === "week" &&
          Object.entries(weekData).map((weekDay, i) => {
            const styles = {
              textShadow: glowState.day[i + 1] ? "0 0 0.5rem #fff" : "none",
              marginBottom: !!coach ? "1em" : "0",
            };

            return (
              <div key={i} className={`calendar-head`} style={styles}>
                <div className="calendar-head-day">{weekDay[0]}</div>
                <div className="calendar-head-date">{weekDay[1].day}</div>

                {calendarView === "week" && !coach && (
                  <div className="calendar-head-court-day">
                    <CalendarHeadCourt day={i} location={location} />
                  </div>
                )}
              </div>
            );
          })
        : currentDate &&
          locationData &&
          locationData.map((location, i) => <CalendarHeadCourt key={location.id} location={location} />)}
    </>
  );
}
