import { Class, Student } from "@prisma/client";
import { prisma } from "../prisma";
import { DateTime } from "luxon";
import { ClassI, CreateClassProps, GetClassesProps, UpdateClassProps } from "./types";
import { convertClass } from "../utils";

export const getClasses = async ({
  startDate,
  days,
  coachId,
  locationId,
}: GetClassesProps): Promise<ClassI[] | undefined> => {
  const start = new Date(startDate);
  const end = DateTime.fromMillis(startDate).plus({ days: days }).toJSDate();

  try {
    const classes = await prisma.class.findMany({
      where: {
        startTime: { gt: start, lt: end },
        coachId: coachId,
        locationId: locationId,
      },
      include: {
        students: true,
        coach: true,
        location: true,
      },
    });

    return classes.map((c) => convertClass(c));
  } catch (error) {
    console.log(error);
  }
};

export const createClass = async ({
  type,
  startTime,
  endTime,
  coachId,
  students,
  locationId,
  courtId,
  note,
  isBreak,
}: CreateClassProps): Promise<ClassI | undefined> => {
  try {
    const c = await prisma.class.create({
      data: {
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        coachId,
        students: {
          connect: students.map((student) => ({
            id: student.id,
          })),
        },
        locationId,
        courtId,
        note,
        isBreak,
      },
      include: {
        students: true,
        coach: true,
        location: true,
      },
    });
    console.log('created class:', c)
    return convertClass(c);
  } catch (error) {
    console.log(error);
  }
};

export const updateClass = async ({
  id,
  type,
  startTime,
  endTime,
  coachId,
  studentIds,
  locationId,
  courtId,
  note,
}: UpdateClassProps): Promise<ClassI | undefined> => {
  try {
    const c = await prisma.class.update({
      where: {
        id,
      },
      data: {
        type,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        coachId,
        students: {
          connect: studentIds?.map((id) => ({
            id,
          })),
        },
        locationId,
        courtId,
        note,
      },
      include: {
        students: true,
        coach: true,
        location: true,
      },
    });

    return convertClass(c);
  } catch (error) {
    console.log(error);
  }
};

export const deleteClass = async (id: string): Promise<Class | undefined> => {
  try {
    return await prisma.class.delete({ where: { id } });
  } catch (error) {
    console.log(error);
  }
};

export const copyClasses = async (copyStart: number, weeks: number): Promise<ClassI[] | void> => {
  try {
    const prevClasses = await getClasses({
      startDate: copyStart,
      days: weeks * 7,
    });

    if (!prevClasses) return undefined;

    const classes = await prisma.$transaction(
      prevClasses.map((c) =>
        prisma.class.create({
          data: {
            type: c.type,
            startTime: DateTime.fromMillis(c.startTime).plus({ weeks }).toJSDate(),
            endTime: DateTime.fromMillis(c.endTime).plus({ weeks }).toJSDate(),
            coachId: c.coachId,
            students: {
              connect: c.students.map((student) => ({
                id: student.id,
              })),
            },
            locationId: c.location.id,
            courtId: c.courtId,
            note: c.note || undefined,
          },
          include: {
            students: true,
            coach: true,
            location: true,
          },
        })
      )
    );

    return classes.map((c) => convertClass(c));
  } catch (error) {
    console.log(error);
  }
};
