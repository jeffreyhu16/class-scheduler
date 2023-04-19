import { prisma } from "../prisma";
import { LocationI } from "./types";

export const getLocations = async (): Promise<LocationI[] | undefined> => {
  try {
    return await prisma.location.findMany();
  } catch (error) {
    console.log(error);
  }
};
