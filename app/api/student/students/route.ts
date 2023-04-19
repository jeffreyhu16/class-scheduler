import { getStudents } from "@/lib/data/student";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json(await getStudents());
}
