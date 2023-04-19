import { prisma } from "../prisma";
import { Student } from "@prisma/client";
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

export const getStudentOptions = async (): Promise<Student[] | undefined> => {
  try {
    return await prisma.student.findMany();
  } catch (error) {
    console.log(error);
  }
};
