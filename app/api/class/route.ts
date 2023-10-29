import { NextResponse } from "next/server";
import { createClass, updateClass, deleteClass } from "@/lib/data/class";
import { CreateClassProps, UpdateClassProps } from "@/lib/data/types";
import { checkRequestBody } from "@/lib/utils";
import { getCoach } from "@/lib/data/coach";

export async function POST(req: Request) {
  const requestBody = await req.json();
  if (
    !checkRequestBody<CreateClassProps>(requestBody, [
      "type",
      "startTime",
      "endTime",
      "coachId",
      "students",
      "locationId",
      "courtId",
      "isBreak",
    ])
  ) {
    return NextResponse.error();
  }
  if (requestBody.coachId === "") {
    const coachNA = await getCoach({ name: { not: "N/A" } });
    requestBody.coachId = coachNA?.id || "";
  }
  return NextResponse.json(await createClass(requestBody));
}

export async function PUT(req: Request) {
  const requestBody = await req.json();
  if (!checkRequestBody<UpdateClassProps>(requestBody, ["id"])) {
    return NextResponse.error();
  }
  return NextResponse.json(await updateClass(requestBody));
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  return id ? NextResponse.json(await deleteClass(id)) : NextResponse.error();
}
