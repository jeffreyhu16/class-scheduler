import { getClasses } from "@/lib/data/class";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const days = searchParams.get("days");
  const coachId = searchParams.get("coachId");
  const locationId = searchParams.get("locationId");

  const classes = await getClasses({
    startDate: Number(startDate),
    days: Number(days),
    coachId: coachId ? Number(coachId) : undefined,
    locationId: locationId ? Number(locationId) : undefined,
  });

  return NextResponse.json(classes);
}
