import { getStudentOptions } from "@/lib/data/student";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const studentOptions = await getStudentOptions();
  return NextResponse.json(studentOptions);
}
