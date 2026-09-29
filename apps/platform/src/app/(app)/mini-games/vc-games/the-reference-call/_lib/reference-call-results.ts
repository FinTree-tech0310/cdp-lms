import type {
  ReferenceCallTranscript,
  TranscriptLine,
} from "../_data/reference-call-transcripts";

export type ReplayLineState = "caught" | "missed" | "clean" | "false-flag";

export interface ReferenceCallResult {
  caught: number;
  missed: number;
  falseFlags: number;
  totalRedFlags: number;
}

export function getReplayLineState(
  line: TranscriptLine,
  flaggedLineIds: ReadonlySet<string>,
): ReplayLineState {
  const wasFlagged = flaggedLineIds.has(line.id);
  if (line.isRedFlag) return wasFlagged ? "caught" : "missed";
  return wasFlagged ? "false-flag" : "clean";
}

export function calculateReferenceCallResult(
  transcript: ReferenceCallTranscript,
  flaggedLineIds: readonly string[],
): ReferenceCallResult {
  const flaggedIds = new Set(flaggedLineIds);
  let caught = 0;
  let missed = 0;
  let falseFlags = 0;

  for (const line of transcript.lines) {
    const replayState = getReplayLineState(line, flaggedIds);
    if (replayState === "caught") caught += 1;
    if (replayState === "missed") missed += 1;
    if (replayState === "false-flag") falseFlags += 1;
  }

  return { caught, missed, falseFlags, totalRedFlags: caught + missed };
}
