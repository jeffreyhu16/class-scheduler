"use client";
import { CSSProperties, useState } from "react";
import Dropdown from "./Dropdown";
import { DateTime, ToObjectOutput } from "luxon";
import { faBars, faAngleLeft, faAngleRight, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import CalendarCopy from "./calendars/CalendarCopy";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { CalendarView, setCalendarView, setLocation, setCoach, setPrintMode } from "@/features/view/slice";
import { setStartOfWeek, setCurrentDate } from "@/features/date/slice";
import MobileNav from "./MobileNav";

export interface ActiveState {
  view: "day" | "week";
  location: number;
  coach: number;
}

export interface HoverState {
  day: boolean;
  week: boolean;
}

export default function HeaderNav() {
  const dispatch = useAppDispatch();
  const { calendarView, locationData, coachData, coach, location } = useAppSelector((state) => state.views);
  const { startOfWeek, currentDate } = useAppSelector((state) => state.dates);

  const [activeState, setActiveState] = useState<ActiveState>({
    view: "week",
    location: 1,
    coach: 1,
  });
  const [hoverState, setHoverState] = useState<HoverState>({ day: false, week: false });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  let currentDay, day1, day7, month, year;
  let nextDay: ToObjectOutput, prevDay: ToObjectOutput, nextWeek: ToObjectOutput, prevWeek: ToObjectOutput;

  if (startOfWeek && currentDate) {
    const currentDateTime = DateTime.fromObject(currentDate);
    const mon = DateTime.fromObject(startOfWeek);
    const sun = mon.plus({ days: 6 });
    currentDay = currentDateTime.day;
    day1 = mon.day;
    day7 = sun.day;
    month = mon.monthLong;
    year = mon.year;

    nextDay = currentDateTime.plus({ days: 1 }).toObject();
    prevDay = currentDateTime.minus({ days: 1 }).toObject();
    nextWeek = mon.plus({ days: 7 }).toObject();
    prevWeek = mon.minus({ days: 7 }).toObject();
  }

  function toggleView(view: CalendarView) {
    dispatch(setCalendarView(view));

    if (view === "week" && locationData) {
      setLocation(locationData[1]);
      setCoach(null);
      setActiveState({ view: "week", location: 1, coach: 1 });
    }

    if (view === "day") {
      setLocation(null);
      setCoach(null);
      setActiveState({ view: "day", location: 0, coach: 1 });
    }
  }

  function shiftTime(direction: "prev" | "next") {
    if (calendarView === "week") {
      if (direction === "next") {
        dispatch(setStartOfWeek(nextWeek));
      } else {
        dispatch(setStartOfWeek(prevWeek));
      }
    }
    if (calendarView === "day") {
      if (direction === "next") {
        dispatch(setCurrentDate(nextDay));
      } else {
        dispatch(setCurrentDate(prevDay));
      }
    }
  }

  const createPdf = async () => {
    dispatch(setPrintMode(true));
    try {
      const calendar = document.getElementById("calendar");
      const canvas = await html2canvas(calendar!);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ unit: "mm" });
      pdf.addImage(imgData, "JPEG", 0, 0, 310, 300);

      let fileName = `week${DateTime.local().weekNumber}.pdf`;

      if (location) {
        fileName = `${location.name}_` + fileName;
      }
      if (coach) {
        fileName = `${coach.name}_` + fileName;
      }

      pdf.save(fileName);
    } catch (error) {
      console.log(error);
    }
    dispatch(setPrintMode(false));
  };

  const castBackground = (view: "day" | "week") => {
    let background;
    if (activeState.view === view && !hoverState[view]) background = "#c9e5ff";
    if (activeState.view === view && hoverState[view]) background = "#c9e5fff1";
    if (activeState.view !== view && !hoverState[view]) background = "#004b8f";
    if (activeState.view !== view && hoverState[view]) background = "#0055a4";
    return background;
  };

  const activeShadow = "0 0 1rem 0 rgba(255, 255, 255, 0.4)";
  const defaultShadow = "0 0 1rem 0 rgba(0, 0, 0, 0.3)";
  const dayStyles: CSSProperties = {
    backgroundColor: castBackground("day"),
    color: activeState.view === "day" ? "#00182f" : "#fff",
    boxShadow: activeState.view === "day" ? activeShadow : defaultShadow,
  };
  const weekStyles: CSSProperties = {
    backgroundColor: castBackground("week"),
    color: activeState.view === "week" ? "#00182f" : "#fff",
    boxShadow: activeState.view === "week" ? activeShadow : defaultShadow,
  };

  return (
    <div className="header-nav">
      <div className="header-left-group">
        <div className="header-nav-dropdown" onClick={() => setIsMobileNavOpen((prev) => !prev)}>
          <FontAwesomeIcon icon={faBars} className="icon-nav-dropdown" />
        </div>

        <div className="header-toggle-group">
          <div
            className="header-toggle-day"
            onClick={() => toggleView("day")}
            onMouseEnter={() => setHoverState((prev) => ({ ...prev, day: true }))}
            onMouseLeave={() => setHoverState((prev) => ({ ...prev, day: false }))}
            style={dayStyles}>
            Day
          </div>
          <div
            className="header-toggle-week"
            onClick={() => toggleView("week")}
            onMouseEnter={() => setHoverState((prev) => ({ ...prev, week: true }))}
            onMouseLeave={() => setHoverState((prev) => ({ ...prev, week: false }))}
            style={weekStyles}>
            Week
          </div>
        </div>

        <div className="header-dropdown-group">
          <Dropdown
            label="location"
            listData={[{ name: "all" }, ...(locationData?.map((location) => ({ name: location.name })) || [])]}
            active={activeState}
            setActive={setActiveState}
          />

          <Dropdown
            label="coach"
            listData={[{ name: "all" }, ...(coachData?.map((coach) => ({ name: coach.name })) || [])]}
            active={activeState}
            setActive={setActiveState}
          />
        </div>
      </div>
      <div className="header-right-group">
        <div className="header-action-group">
          <CalendarCopy />
          <FontAwesomeIcon icon={faUpRightFromSquare} className="icon-export" onClick={() => createPdf()} />
        </div>
        {currentDate && (
          <div className="header-date">
            <div className="header-date-day">{calendarView === "week" ? `${day1} - ${day7}` : currentDay}</div>
            <div className="header-date-month">{month}</div>
            <div className="header-date-year">{year}</div>
          </div>
        )}
        <div className="toggle-period">
          <div className="icon-angle-left-container" onClick={() => shiftTime("prev")}>
            <FontAwesomeIcon icon={faAngleLeft} className="icon-angle-left" />
          </div>
          <div className="icon-angle-right-container" onClick={() => shiftTime("next")}>
            <FontAwesomeIcon icon={faAngleRight} className="icon-angle-right" />
          </div>
        </div>
      </div>

      {isMobileNavOpen && (
        <MobileNav
          onClose={setIsMobileNavOpen}
          toggleView={toggleView}
          dayStyles={dayStyles}
          weekStyles={weekStyles}
          activeState={activeState}
          setActiveState={setActiveState}
        />
      )}
    </div>
  );
}
