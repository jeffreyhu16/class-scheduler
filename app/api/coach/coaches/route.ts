import { NextResponse } from "next/server";
import { getCoaches } from "@/lib/data/coach";

export async function GET(req: Request) {
  return NextResponse.json(await getCoaches());
}
