import { ClassFormInputs } from "@/components/ClassForm";
import { Class, Student, Coach, Location } from "@prisma/client";
import { DateTime } from "luxon";
import { ClassI, CreateClassProps, UpdateClassProps } from "./data/types";

export const getRequestValue = (req: any, domain: string, key: string) => {
  if (req && req[domain]) {
    return Array.isArray(req[domain][key]) ? req[domain][key][0] : req[domain][key];
  }
  return undefined;
};

export const checkRequestBody = <T>(body: any, fields: string[]): body is T => {
  const checkResult = Object.keys(body).every((key) => fields.includes(key));
  console.log("checkResult:", checkResult);
  return Object.keys(body).every((key) => fields.includes(key));
  // return fields.every((field) => !!body[field]);
};

export const convertClass = (
  c: Class & {
    coach: Coach;
    location: Location;
    students: Student[];
  }
): ClassI => {
  return {
    id: c.id,
    type: c.type,
    startTime: DateTime.fromJSDate(c.startTime).toMillis(),
    endTime: DateTime.fromJSDate(c.endTime).toMillis(),
    coachId: c.coachId,
    coach: c.coach,
    students: c.students,
    location: c.location,
    courtId: c.courtId,
    note: c.note || undefined,
    isBreak: c.isBreak,
  };
};

export const convertFormInputs = (form: ClassFormInputs, editClassId?: number): CreateClassProps | UpdateClassProps => {
  return {
    ...(editClassId && { id: editClassId }),
    type: form.type,
    startTime: form.startTime,
    endTime: form.endTime,
    coachId: form.coach.id,
    students: form.students,
    locationId: form.location.id,
    courtId: form.courtId,
    note: form.note,
    isBreak: form.isBreak,
  };
};
