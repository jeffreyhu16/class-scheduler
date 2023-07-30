import { Class, Student, Coach, Location } from "@prisma/client";
import { DateTime } from "luxon";
import { ClassI } from "./data/types";

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
    isLeave: c.isLeave,
  };
};
