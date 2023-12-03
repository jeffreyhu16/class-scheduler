import React from "react";
import CalendarQuarterHour from "./CalendarQuarterHour";
import { LocationI } from "@/lib/data/types";
import { useAppSelector } from "@/redux/store";

export interface CalendarCourtProps {
  location?: LocationI;
  courtId: number;
  day?: number;
}

export default function CalendarCourt({ location, courtId, day = 0 }: CalendarCourtProps) {
  const views = useAppSelector((state) => state.views);

  const courtCount = location?.courtCount || views.location?.courtCount;

  const styles = {
    width: day ? `calc(100% / ${courtCount})` : "calc(100% / 7)",
  };

  return (
    <div
      className={day ? `calendar-court court-${courtId}` : `calendar-court ${location?.name}-${courtId}`}
      style={styles}>
      {[...Array(64)].map((k, i) => (
        <CalendarQuarterHour
          key={`quarter-hour-${i + 1}`}
          day={day}
          locationId={location?.id}
          courtId={courtId}
          quarterHour={i + 1}
        />
      ))}
    </div>
  );
}
