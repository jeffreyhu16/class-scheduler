import { Coach } from "@prisma/client";
import { prisma } from "../prisma";
import { CoachI, GetCoachParams } from "./types";

export const getCoach = async ({ name, email }: GetCoachParams): Promise<Coach | undefined> => {
  try {
    const coach = await prisma.coach.findFirst({
      where: { name, email },
    });
    return coach ?? undefined;
  } catch (error) {
    console.log(error);
  }
};

export const getCoaches = async ({ email }: GetCoachParams): Promise<CoachI[] | undefined> => {
  try {
    return await prisma.coach.findMany({
      where: {
        name: { not: "N/A" },
        email,
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
