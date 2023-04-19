"use client"
import React, { Dispatch, SetStateAction, useState } from "react";
import { setCalendarView, setLocation, setCoach, ListItem } from "@/features/view/slice";
import { ActiveState } from "./HeaderNav";
import { useAppSelector } from "@/redux/store";
import { CoachI, LocationI } from "@/lib/data/types";

export interface DropdownItemProps {
  label: string;
  item: ListItem;
  active: ActiveState;
  setActive: Dispatch<SetStateAction<ActiveState>>;
  index: number;
}

export default function DropdownItem({ label, item, active, setActive, index }: DropdownItemProps) {
  const { coach, location } = useAppSelector((state) => state.views);
  const [on, setOn] = useState<boolean[]>([]);

  const itemStyles = {
    backgroundColor: on[index] ? "#c9e5ff" : active[label as keyof ActiveState][index] ? "#c9e5ff" : "#004b8f",
    color: on[index] ? "#00182f" : active[label as keyof ActiveState][index] ? "#00182f" : "#fff",
  };

  function handleClick(index: number) {
    if (label === "location") {
      if (item.name === "all" && !coach) {
        setCalendarView("day");
        setActive((prevActive) => ({
          ...prevActive,
          view: [true, false],
        }));
      }
      setLocation(item as LocationI);
    }

    if (label === "coach") {
      if (item.name === "all" && !location) {
        setCalendarView("day");
        setActive((prevActive) => ({
          ...prevActive,
          view: [true, false],
        }));
      }
      setCoach(item as CoachI);
    }
    setActive((prevActive) => {
      const newActive = { ...prevActive };
      newActive[label as keyof ActiveState].fill(false);
      newActive[label as keyof ActiveState][index] = true;
      return newActive;
    });
  }

  function handleOnMouse(isHover: boolean, index: number) {
    setOn((prevOnArr) => {
      const newOnArr = [...prevOnArr];
      newOnArr[index] = isHover;
      return newOnArr;
    });
  }

  return (
    <div
      className="dropdown-menu-list-item"
      onClick={() => handleClick(index)}
      onMouseEnter={() => handleOnMouse(true, index)}
      onMouseLeave={() => handleOnMouse(false, index)}
      style={itemStyles}>
      {item.name}
    </div>
  );
}
