"use client";
import React, { CSSProperties } from "react";
import CalendarHead from "./CalendarHead";
import CalendarTime from "./CalendarTime";
import CalendarDay from "./CalendarDay";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { useAppSelector } from "@/redux/store";

export default function Calendar() {
  const { calendarView, coach, location, printMode } = useAppSelector((state) => state.views);

  const camberwell = location?.key === "camberwell";
  const wideView = calendarView === "week" && coach === null;
  const scrollView = calendarView === "week" && coach === null && camberwell;

  const styles: { [key: string]: CSSProperties } = {
    calendar: {
      ...(wideView && { width: "100%" }),
    },
    label: {
      fontSize: printMode ? "1.25rem" : "1rem",
      opacity: scrollView ? "0" : "1",
    },
    flexView: {
      ...(scrollView && { width: "180em" }),
    },
  };

  return (
    <ScrollSync>
      <div id="calendar" className="calendar" style={styles.calendar}>
        <div className="coach-label-container">
          <div className="coach-label" style={styles.label}>
            {coach?.name}
          </div>
        </div>

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
