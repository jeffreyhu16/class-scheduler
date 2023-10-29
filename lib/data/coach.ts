import { Coach } from "@prisma/client";
import { prisma } from "../prisma";
import { CoachI, GetCoachParams } from "./types";

export const getCoach = async ({ name }: GetCoachParams): Promise<Coach | undefined> => {
  try {
    const coach = await prisma.coach.findFirst({
      where: { name },
    });
    return coach ?? undefined;
  } catch (error) {
    console.log(error);
  }
};

export const getCoaches = async (): Promise<CoachI[] | undefined> => {
  try {
    return await prisma.coach.findMany({
      where: {
        name: { not: "N/A" },
      },
      include: {
        students: true,
        classes: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
