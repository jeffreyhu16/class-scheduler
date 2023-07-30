"use client";
import React, { CSSProperties } from "react";
import CalendarHead from "./CalendarHead";
import CalendarTime from "./CalendarTime";
import CalendarDay from "./CalendarDay";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { useAppSelector } from "@/redux/store";

export default function Calendar() {
  const { calendarView, coach, location, printMode, breakPoint } = useAppSelector((state) => state.views);

  const camberwell = location?.name === "camberwell";
  const wideView = calendarView === "week" && !coach;
  const scrollView = calendarView === "week" && !coach && camberwell;

  let flexView;
  if (scrollView) {
    flexView = "180em";
  } else if (!breakPoint[780]) {
    flexView = "41.2875em";
  } else {
    flexView = "100%";
  }

  const styles: { [key: string]: CSSProperties } = {
    calendar: {
      width: wideView || !breakPoint[1280] ? "100%" : "calc(100% - 300px)",
    },
    label: {
      fontSize: printMode ? "1.25rem" : "1rem",
    },
    flexView: {
      width: flexView,
    },
  };

  return (
    <ScrollSync>
      <div id="calendar" className="calendar" style={styles.calendar}>
        {coach && (
          <div className="coach-label-container">
            <div className="coach-label" style={styles.label}>
              {coach.name}
            </div>
          </div>
        )}
        <div className="calendar-head-sticky">
          <ScrollSyncPane>
            <div className="calendar-head-scroll">
              <div className="calendar-head-flex" style={styles.flexView}>
                <CalendarHead />
              </div>
            </div>
          </ScrollSyncPane>
        </div>
        <div className="calendar-body-group">
          <div className="calendar-time">
            <CalendarTime />
          </div>
          <ScrollSyncPane>
            <div className="calendar-body-scroll">
              <div className="calendar-body-flex" style={styles.flexView}>
                {calendarView === "week" ? (
                  [...Array(7)].map((k, i) => <CalendarDay key={`day-${i + 1}`} day={i + 1} />)
                ) : (
                  <CalendarDay />
                )}
              </div>
            </div>
          </ScrollSyncPane>
        </div>
      </div>
    </ScrollSync>
  );
}
