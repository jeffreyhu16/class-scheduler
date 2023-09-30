"use client";
import React, { CSSProperties } from "react";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppSelector } from "@/redux/store";
import DateTime from "lib/date";

export default function CalendarCopy() {
  const router = useRouter();
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const { startOfWeek } = useAppSelector((state) => state.dates);
  const { calendarView, coach } = useAppSelector((state) => state.views);

  async function copyClasses(weeks: number) {
    if (!startOfWeek) return;

    try {
      await axios.post("/api/class/copy", {
        copyStart: DateTime.fromObject(startOfWeek).toMillis(),
        weeks,
      });

      router.refresh();
    } catch (err) {
      console.log(err);
    }
  }

  const copyStyles = {
    paddingTop: calendarView === "week" && coach === null ? "0.3em" : "0.2em",
  };
  const popupStyles: CSSProperties = {
    opacity: modalIsOpen ? "1" : "0",
    transform: modalIsOpen ? "translate(-50%, 0.4em)" : "translate(-50%, 0)",
    pointerEvents: modalIsOpen ? "auto" : "none",
  };

  return (
    <div className="calendar-copy" onClick={() => setModalIsOpen((prev) => !prev)}>
      <FontAwesomeIcon icon={faCopy} className="icon-copy" />
      <div className="calendar-copy-popup" style={popupStyles}>
        <div className="calendar-copy-msg">
          Copy from <span>previous week</span>
        </div>
        <div className="calendar-copy-confirm" onClick={() => copyClasses(1)}>
          Confirm
        </div>
      </div>
    </div>
  );
}
