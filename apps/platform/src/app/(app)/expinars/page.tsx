import { fetchExpinarEvents } from "@/lib/expinars-server";
import { ExpinarsBoard } from "@/components/expinars/expinars-board";

/**
 * /expinars — live and upcoming sessions plus the recording library.
 * Catalog comes from expinar_events (migration 0006), with a code fallback
 * so the page renders even before the migration runs. Auth is enforced by
 * the middleware protecting this route.
 */
export default async function ExpinarsPage() {
  const events = await fetchExpinarEvents();

  return <ExpinarsBoard events={events} serverNow={Date.now()} />;
}
