import { NextRequest, NextResponse } from "next/server";
import { getCoaches } from "@/lib/data/coach";
import { withApiAuthRequired, getSession, Session } from "@auth0/nextjs-auth0";

export const GET = withApiAuthRequired(async (req: NextRequest) => {
  const { user } = (await getSession(req, new NextResponse())) as Session;

  // Whitelisted admins are allowed to get all coaches
  const email = user.isAdmin || process.env.DEMO_STATUS === "true" ? undefined : user.email;

  return NextResponse.json(await getCoaches({ email }));
});
