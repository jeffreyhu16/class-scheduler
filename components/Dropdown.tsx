"use client"
import React, { CSSProperties, Dispatch, SetStateAction } from "react";
import DropdownItem from "./DropdownItem";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActiveState } from "./HeaderNav";
import { ListItem } from "@/features/view/slice";

export interface DropdownProps {
  label: string;
  active: ActiveState;
  listData: ListItem[];
  setActive: Dispatch<SetStateAction<ActiveState>>;
}

export default function Dropdown({ label, listData, active, setActive }: DropdownProps) {
  const [isOn, setIsOn] = React.useState(false);

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
        {listData.map((item, i) => (
          <DropdownItem key={item.name} label={label} item={item} active={active} setActive={setActive} index={i + 1} />
        ))}
      </div>
    </div>
  );
}
