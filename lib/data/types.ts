import { StudentType, ClassType, Coach, Location, Student, Class } from "@prisma/client";

export interface StudentI {
  id: number;
  type: StudentType;
  name: string;
  dob: Date | null;
  phone: string | null;
  guardian: string | null;
  coaches: Coach[];
  classes: Class[];
}

export interface CoachI {
  id: number;
  name: string;
  payRate: number | null;
  students?: Student[];
  classes?: Class[];
}

export interface ClassI {
  id: number;
  type: ClassType;
  startTime: number;
  endTime: number;
  coachId: number;
  coach: Coach;
  students: Student[];
  location: Location;
  courtId: number;
  note?: string;
  isBreak: boolean;
}

export interface LocationI {
  id: number;
  key: string;
  name: string;
  courtCount: number;
  classes?: Class[];
}

export interface GetClassesProps {
  startDate: number;
  days: number;
  coachId?: number;
  locationId?: number;
}

export interface CreateClassProps {
  type: ClassType;
  startTime: number;
  endTime: number;
  coachId: number;
  students: Student[];
  locationId: number;
  courtId: number;
  note?: string;
  isBreak: boolean;
}

export interface CreateClassesProps extends Omit<CreateClassProps, "studentIds"> {}

export interface UpdateClassProps {
  id: number;
  type?: ClassType;
  startTime?: number;
  endTime?: number;
  coachId?: number;
  studentIds?: number[];
  locationId?: number;
  courtId?: number;
  note?: string;
}
