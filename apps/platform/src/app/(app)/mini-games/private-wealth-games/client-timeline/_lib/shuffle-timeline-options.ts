import type { TimelineStopOption } from "../_data/client-timeline-scenarios";

export function shuffleTimelineOptionIds(
  options: readonly TimelineStopOption[],
): [string, string] {
  if (options.length !== 2) {
    throw new Error("Client Timeline stops must contain exactly two options.");
  }
  return Math.random() < 0.5
    ? [options[0].id, options[1].id]
    : [options[1].id, options[0].id];
}
