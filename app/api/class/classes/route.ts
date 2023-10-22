import { getClasses } from "@/lib/data/class";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const coachId = searchParams.get("coachId");
  const locationId = searchParams.get("locationId");
  const courtId = searchParams.get("courtId");

  if (!startDate || !endDate) return NextResponse.json([]);

  const classes = await getClasses({
    startDate: Number(startDate),
    endDate: Number(endDate),
    coachId: coachId ?? undefined,
    locationId: locationId ?? undefined,
    courtId: Number(courtId) || undefined,
  });

  return NextResponse.json(classes);
}
