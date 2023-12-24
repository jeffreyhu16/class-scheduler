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
  isMobile?: boolean;
  setActive: Dispatch<SetStateAction<ActiveState>>;
}

export default function Dropdown({ label, listData, active, isMobile, setActive }: DropdownProps) {
  const [isOn, setIsOn] = useState<boolean>(false);
  const [hoverIndex, setHoverIndex] = useState<number>(-1);

  const dispatch = useAppDispatch();
  const { coach, coachData, location, locationData } = useAppSelector((state) => state.views);

  function handleClick(itemName: string, index: number) {
    if (!coachData || !locationData) return;

    if (label === "location") {
      if (itemName === "all" && coach === null) {
        dispatch(setLocation(null));
        dispatch(setCalendarView("day"));
        setActive((prev) => ({
          ...prev,
          view: "day",
        }));
        return;
      }
      dispatch(setLocation(locationData.find((location) => location.name === itemName) || null));
    }

    if (label === "coach") {
      if (itemName === "all" && location == null) {
        dispatch(setCoach(null));
        dispatch(setCalendarView("day"));
        setActive((prev) => ({
          ...prev,
          view: "day",
        }));
        return;
      }
      dispatch(setCoach(coachData.find((coach) => coach.name === itemName) || null));
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
    <>
      {listData.length > 1 && (
        <button
          className={`dropdown-menu ${isMobile ? "mobile-nav-option" : ""}`}
          onClick={() => setIsOn((prev) => !prev)}>
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
        </button>
      )}
    </>
  );
}
