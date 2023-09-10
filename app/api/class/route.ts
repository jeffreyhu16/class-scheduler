import { NextRequest, NextResponse } from "next/server";
import { createClass, updateClass, deleteClass } from "@/lib/data/class";
import { CreateClassProps, UpdateClassProps } from "@/lib/data/types";
import { checkRequestBody } from "@/lib/utils";

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
      "note",
      "isBreak",
    ])
  ) {
    return NextResponse.error();
  }
  const { type, startTime, endTime, coachId, students, locationId, courtId, note, isBreak } = requestBody;
  return NextResponse.json(
    await createClass({ type, startTime, endTime, coachId, students, locationId, courtId, note, isBreak })
  );
}

export async function PUT(req: Request) {
  if (
    !checkRequestBody<UpdateClassProps>(req.body, [
      "id",
      "type",
      "startTime",
      "endTime",
      "coachId",
      "studentIds",
      "locationId",
      "courtId",
      "note",
    ])
  ) {
    return NextResponse.error();
  }
  const { id, type, startTime, endTime, coachId, studentIds, locationId, courtId, note } = req.body;
  return NextResponse.json(
    await updateClass({ id, type, startTime, endTime, coachId, studentIds, locationId, courtId, note })
  );
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  return id ? NextResponse.json(await deleteClass(id)) : NextResponse.error();
}
