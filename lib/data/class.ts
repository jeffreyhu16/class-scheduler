import { Class, Student } from "@prisma/client";
import { prisma } from "../prisma";
import { DateTime } from "luxon";
import { ClassI, CreateClassProps, GetClassesProps, UpdateClassProps } from "./types";

export const getClasses = async ({
  start,
  days,
  coachId,
  locationId,
}: GetClassesProps): Promise<ClassI[] | undefined> => {
  const end = DateTime.fromJSDate(start).plus({ days: days }).toJSDate();

  try {
    return await prisma.class.findMany({
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
  } catch (error) {
    console.log(error);
  }
};

export const createClass = async ({
  type,
  startTime,
  endTime,
  coachId,
  studentIds,
  locationId,
  courtId,
  note,
}: CreateClassProps): Promise<ClassI | undefined> => {
  try {
    return await prisma.class.create({
      data: {
        type,
        startTime,
        endTime,
        coachId,
        students: {
          connect: studentIds.map((id) => ({
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
    return await prisma.class.update({
      where: {
        id,
      },
      data: {
        type,
        startTime,
        endTime,
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
  } catch (error) {
    console.log(error);
  }
};

export const deleteClass = async (id: number): Promise<Class | undefined> => {
  try {
    return await prisma.class.delete({ where: { id } });
  } catch (error) {
    console.log(error);
  }
};

export const copyClasses = async (copyStart: Date, weeks: number): Promise<ClassI[] | void> => {
  try {
    const prevClasses = await getClasses({
      start: copyStart,
      days: weeks * 7,
    });

    if (!prevClasses) return undefined;

    return await prisma.$transaction(
      prevClasses.map((c) =>
        prisma.class.create({
          data: {
            type: c.type,
            startTime: DateTime.fromJSDate(c.startTime).plus({ weeks }).toJSDate(),
            endTime: DateTime.fromJSDate(c.endTime).plus({ weeks }).toJSDate(),
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
  } catch (error) {
    console.log(error);
  }
};
