import { prisma } from "../prisma";
import { CoachI } from "./types";

export const getCoaches = async (): Promise<CoachI[] | undefined> => {
  try {
    return await prisma.coach.findMany({
      include: {
        students: true,
        classes: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
