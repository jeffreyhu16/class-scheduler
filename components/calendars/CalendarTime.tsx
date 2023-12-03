import React from "react";
import { useAppSelector } from "@/redux/store";
import { DateTime } from "luxon";

export default function CalendarTime() {
  const time = DateTime.local().set({ hour: 7, minute: 0 });

  const glowState = useAppSelector((state) => state.glow);

  return (
    <>
      {[...Array(64)].map((k, i) => {
        const newTime = time.plus({ minutes: 15 * i });

        const styles = {
          textShadow: glowState.quarterHour[++i] ? "0 0 0.5rem #fff" : "none",
          opacity: glowState.quarterHour[i] ? 1 : 0,
        };

        return (
          <div key={i} className={`calendar-time-quarter`} style={styles}>
            {newTime.hour > 12 ? newTime.hour - 12 : newTime.hour}:{newTime.minute === 0 ? "00" : newTime.minute}
          </div>
        );
      })}
    </>
  );
}
