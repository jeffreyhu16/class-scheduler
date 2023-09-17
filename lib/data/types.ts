import { StudentType, ClassType, Coach, Location, Student, Class } from "@prisma/client";

export interface StudentI {
  id: string;
  type: StudentType;
  name: string;
  dob: Date | null;
  phone: string | null;
  guardian: string | null;
  coaches: Coach[];
  classes: Class[];
}

export interface CoachI {
  id: string;
  name: string;
  payRate: number | null;
  students?: Student[];
  classes?: Class[];
}

export interface ClassI {
  id: string;
  type: ClassType;
  startTime: number;
  endTime: number;
  coachId: string;
  coach: Coach;
  students: Student[];
  location: Location;
  courtId: number;
  note?: string;
  isBreak: boolean;
}

export interface LocationI {
  id: string;
  key: string;
  name: string;
  courtCount: number;
  classes?: Class[];
}

export interface GetClassesProps {
  startDate: number;
  day: number;
  coachId?: string;
  locationId?: string;
}

export interface CreateClassProps {
  type: ClassType;
  startTime: number;
  endTime: number;
  coachId: string;
  students: Student[];
  locationId: string;
  courtId: number;
  note?: string;
  isBreak: boolean;
}

export interface CreateClassesProps extends Omit<CreateClassProps, "studentIds"> {}

export interface UpdateClassProps {
  id: string;
  type?: ClassType;
  startTime?: number;
  endTime?: number;
  coachId?: string;
  studentIds?: string[];
  locationId?: string;
  courtId?: number;
  note?: string;
  isBreak?: boolean;
}

export interface CopyClassParams {
  copyStart: number;
  weeks: number;
}
