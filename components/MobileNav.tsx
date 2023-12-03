import { CalendarView } from "@/features/view/slice";
import { useAppSelector } from "@/redux/store";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties } from "react";
import Dropdown from "./Dropdown";
import { ActiveState } from "./HeaderNav";

interface MobileNavProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  toggleView: (view: CalendarView) => void;
  dayStyles: CSSProperties;
  weekStyles: CSSProperties;
  activeState: ActiveState;
  setActiveState: React.Dispatch<React.SetStateAction<ActiveState>>;
}

export default function MobileNav({
  onClose,
  toggleView,
  dayStyles,
  weekStyles,
  activeState,
  setActiveState,
}: MobileNavProps) {
  const { locationData, coachData } = useAppSelector((state) => state.views);

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-header" onClick={() => onClose(false)}>
        <FontAwesomeIcon style={{ fontSize: 32 }} icon={faXmark} />
      </div>

      <div className="mobile-nav-options">
        <Dropdown
          label="location"
          listData={[{ name: "all" }, ...(locationData?.map((location) => ({ name: location.name })) || [])]}
          active={activeState}
          isMobile={true}
          setActive={setActiveState}
        />
        <Dropdown
          label="coach"
          listData={[{ name: "all" }, ...(coachData?.map((coach) => ({ name: coach.name })) || [])]}
          active={activeState}
          isMobile={true}
          setActive={setActiveState}
        />
        <div className="header-toggle-day mobile-nav-option" onClick={() => toggleView("day")} style={dayStyles}>
          Day
        </div>
        <div className="header-toggle-week mobile-nav-option" onClick={() => toggleView("week")} style={weekStyles}>
          Week
        </div>
      </div>
    </div>
  );
}
