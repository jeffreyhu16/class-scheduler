import { NextRequest, NextResponse } from "next/server";
import { getCoaches } from "@/lib/data/coach";
import { withApiAuthRequired, getSession, Session } from "@auth0/nextjs-auth0";

export const GET = withApiAuthRequired(async (req: NextRequest) => {
  const { user } = (await getSession(req, new NextResponse())) as Session;

  // Whitelisted admins allow able to get all coaches
  const email = process.env.ADMIN_LIST?.split(",").includes(user.email) ? undefined : user.email;

  return NextResponse.json(await getCoaches({ email }));
});
