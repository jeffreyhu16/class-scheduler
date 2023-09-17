import { copyClasses } from "@/lib/data/class";
import { CopyClassParams } from "@/lib/data/types";
import { checkRequestBody } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const requestBody = await req.json();
  if (!checkRequestBody<CopyClassParams>(requestBody, ["copyStart", "weeks"])) {
    return NextResponse.error();
  }
  const { copyStart, weeks } = requestBody;
  return NextResponse.json(await copyClasses({ copyStart, weeks }));
}
