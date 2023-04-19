"use client"
import { CSSProperties, useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { DateTime, Settings, ToObjectOutput } from "luxon";
import { faBars, faAngleLeft, faAngleRight, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import CalendarCopy from "./calendars/CalendarCopy";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { CalendarView, setCalendarView, setLocation, setCoach, setPrintMode } from "@/features/view/slice";
import { setStartOfWeek, setCurrentDate } from "@/features/date/slice";

export interface ActiveState {
  view: (boolean | undefined)[];
  location: (boolean | undefined)[];
  coach: (boolean | undefined)[];
}

export default function HeaderNav() {
  const dispatch = useAppDispatch();
  const { calendarView, locationData, coachData, breakPoint, printMode } = useAppSelector((state) => state.views);
  const { startOfWeek, currentDate } = useAppSelector((state) => state.dates);

  const [active, setActive] = useState<ActiveState>({ view: [, true], location: [, true], coach: [, , , true] });
  const [isHover, setIsHover] = useState<boolean[]>([]);

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
      setCoach(undefined);
      setActive({ view: [false, true], location: [false, false, true], coach: [false, true] });
    }

    if (view === "day") {
      setLocation(undefined);
      setCoach(undefined);
      setActive({ view: [true, false], location: [false, true], coach: [false, true] });
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
        setCurrentDate(nextDay);
      } else {
        setCurrentDate(prevDay);
      }
    }
  }

  const createPdf = async () => {
    try {
      const calendar = document.getElementById("calendar");
      const canvas = await html2canvas(calendar!);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "mm" });
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 330);
      pdf.save("calendar.pdf");
      dispatch(setPrintMode(false));
    } catch (error) {
      console.log(error);
    }
  };

  const castBackground = (i: number) => {
    let background;
    if (active.view[i] && !isHover[i]) background = "#c9e5ff";
    if (active.view[i] && isHover[i]) background = "#c9e5fff1";
    if (!active.view[i] && !isHover[i]) background = "#004b8f";
    if (!active.view[i] && isHover[i]) background = "#0055a4";
    return background;
  };

  useEffect(() => {
    if (!printMode) return;

    createPdf();
  }, [printMode]);

  const activeShadow = "0 0 1rem 0 rgba(255, 255, 255, 0.4)";
  const defaultShadow = "0 0 1rem 0 rgba(0, 0, 0, 0.3)";
  const dayStyles: CSSProperties = {
    backgroundColor: castBackground(0),
    color: active.view[0] ? "#00182f" : "#fff",
    boxShadow: active.view[0] ? activeShadow : defaultShadow,
  };
  const weekStyles: CSSProperties = {
    backgroundColor: castBackground(1),
    color: active.view[1] ? "#00182f" : "#fff",
    boxShadow: active.view[1] ? activeShadow : defaultShadow,
  };

  return (
    <div className="header-nav">
      <div className="header-left-group">
        {!breakPoint[780] && (
          <div className="header-nav-dropdown">
            <FontAwesomeIcon icon={faBars} className="icon-nav-dropdown" />
          </div>
        )}
        {breakPoint[780] && (
          <div className="header-toggle-group">
            <div
              className="header-toggle-day"
              onClick={() => toggleView("day")}
              onMouseEnter={() => setIsHover([true, false])}
              onMouseLeave={() => setIsHover([false, false])}
              style={dayStyles}>
              Day
            </div>
            <div
              className="header-toggle-week"
              onClick={() => toggleView("week")}
              onMouseEnter={() => setIsHover([false, true])}
              onMouseLeave={() => setIsHover([false, false])}
              style={weekStyles}>
              Week
            </div>
          </div>
        )}
        {breakPoint[660] && (
          <div className="header-dropdown-group">
            {locationData && (
              <Dropdown
                label="location"
                listData={[{ name: "all" }, ...locationData]}
                active={active}
                setActive={setActive}
              />
            )}
            {coachData && (
              <Dropdown
                label="coach"
                listData={[{ name: "all" }, ...coachData]}
                active={active}
                setActive={setActive}
              />
            )}
          </div>
        )}
      </div>
      <div className="header-right-group">
        <div className="header-action-group">
          <CalendarCopy />
          <FontAwesomeIcon
            icon={faUpRightFromSquare}
            className="icon-export"
            onClick={() => dispatch(setPrintMode(true))}
          />
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
    </div>
  );
}
