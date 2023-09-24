"use client";
import { useState, CSSProperties, Dispatch, SetStateAction } from "react";
import { setCalendarView, setLocation, setCoach, ListItem } from "@/features/view/slice";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ActiveState } from "./HeaderNav";

export interface DropdownProps {
  label: string;
  active: ActiveState;
  listData: ListItem[];
  setActive: Dispatch<SetStateAction<ActiveState>>;
}

export default function Dropdown({ label, listData, active, setActive }: DropdownProps) {
  const [isOn, setIsOn] = useState<boolean>(false);
  const [hoverIndex, setHoverIndex] = useState<number>(-1);

  const dispatch = useAppDispatch();
  const { coach, coachData, location, locationData } = useAppSelector((state) => state.views);

  function handleClick(itemName: string, index: number) {
    if (label === "location") {
      if (itemName === "all" && !coach) {
        dispatch(setLocation(undefined));
        dispatch(setCalendarView("day"));
        setActive((prev) => ({
          ...prev,
          view: "day",
        }));
      }
      dispatch(setLocation(locationData?.find((location) => location.name === itemName)));
    }

    if (label === "coach") {
      if (itemName === "all" && !location) {
        dispatch(setCoach(undefined));
        dispatch(setCalendarView("day"));
        setActive((prev) => ({
          ...prev,
          view: "day",
        }));
      }
      dispatch(setCoach(coachData?.find((coach) => coach.name === itemName)));
    }

    setActive((prev) => ({
      ...prev,
      [label]: index,
    }));
  }

  const listStyles: CSSProperties = {
    opacity: isOn ? "1" : "0",
    transform: isOn ? "translateY(0)" : "translateY(-0.4em)",
    pointerEvents: isOn ? "auto" : "none",
  };

  return (
    <div className="dropdown-menu" onClick={() => setIsOn((prev) => !prev)}>
      <div className="dropdown-menu-label">{label}</div>
      <FontAwesomeIcon icon={faCaretDown} className="icon-caret-down" />
      <div className="dropdown-menu-list" style={listStyles}>
        {listData.map((item, i) => {
          const isAccent = hoverIndex === i || active[label as keyof ActiveState] === i;
          return (
            <div
              key={item.name}
              className="dropdown-menu-list-item"
              onClick={() => handleClick(item.name, i)}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(-1)}
              style={{
                backgroundColor: isAccent ? "#c9e5ff" : "#004b8f",
                color: isAccent ? "#00182f" : "#fff",
              }}>
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
