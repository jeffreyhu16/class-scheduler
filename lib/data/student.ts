import { prisma } from "../prisma";
import { StudentI } from "./types";

export const getStudents = async (): Promise<StudentI[] | undefined> => {
  try {
    return await prisma.student.findMany({
      include: {
        coaches: true,
        classes: true,
      }
    });
  } catch (error) {
    console.log(error);
  }
};
