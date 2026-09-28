import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getUpcomingExpinar } from "@/lib/dashboard";
import { getExpinarEventById } from "@/lib/expinars-server";
import { buildExpinarIcs } from "@/lib/ics";

/**
 * GET /api/expinar/calendar — downloadable .ics for a session.
 * ?id=<expinar_events.id> picks that session; without it, the next live
 * Expinar (the original behaviour, kept for existing links).
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  const expinar = id
    ? await getExpinarEventById(id)
    : await getUpcomingExpinar(user.id);

  if (!expinar) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const ics = buildExpinarIcs(expinar);

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="expinar.ics"',
      "Cache-Control": "no-store",
    },
  });
}
