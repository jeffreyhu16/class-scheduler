import { getClasses } from "@/lib/data/class";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = Number(searchParams.get("startDate"));
  const days = Number(searchParams.get("days"));
  const coachId = Number(searchParams.get("coachId"));
  const locationId = Number(searchParams.get("locationId"));

  return NextResponse.json(await getClasses({ startDate, days, coachId, locationId }));
}
