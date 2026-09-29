import type { Metadata } from "next";

import { MiniGamesBoard } from "@/components/mini-games/mini-games-board";
import { getMiniGameProgress } from "@/lib/mini-games-server";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mini Games | Rarewise",
  description:
    "Twenty-six interactive mini-games across five finance career pathways — screens, negotiations, pitches and market calls.",
};

/**
 * /mini-games — the catalogue for all 26 ported mini-games.
 *
 * Server component: reads this user's stored runs (Supabase, or
 * `persisted: false` in demo mode) and hands them to the client board,
 * which merges its local mirror when the backend has nothing yet.
 */
export default async function MiniGamesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const progress = user
    ? await getMiniGameProgress(user.id)
    : { persisted: false, items: [] };

  return <MiniGamesBoard initialProgress={progress} />;
}
