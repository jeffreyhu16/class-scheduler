import { getLocations } from "@/lib/data/location";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json(await getLocations());
}
