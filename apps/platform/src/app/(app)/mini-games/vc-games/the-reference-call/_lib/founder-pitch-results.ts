import type { FounderPitchLine, FounderPitchTranscript, PitchJudgment } from "../_data/founder-pitch-transcripts";

export type FounderReplayState =
  | "green-caught"
  | "red-caught"
  | "missed-green"
  | "missed-red"
  | "false-green"
  | "false-red"
  | "wrong-direction"
  | "neutral";

export interface FounderPitchResult {
  correctGreen: number;
  correctRed: number;
  missedSignals: number;
  falseGreenFlags: number;
  falseRedFlags: number;
  wrongDirection: number;
  meaningfulSignals: number;
  correctSignals: number;
}

export function getFounderReplayState(line: FounderPitchLine, judgment?: PitchJudgment): FounderReplayState {
  if (line.signalType === "green") {
    if (!judgment) return "missed-green";
    return judgment === "green" ? "green-caught" : "wrong-direction";
  }
  if (line.signalType === "red") {
    if (!judgment) return "missed-red";
    return judgment === "red" ? "red-caught" : "wrong-direction";
  }
  if (judgment === "green") return "false-green";
  if (judgment === "red") return "false-red";
  return "neutral";
}

export function calculateFounderPitchResult(
  transcript: FounderPitchTranscript,
  judgments: Readonly<Record<string, PitchJudgment>>,
): FounderPitchResult {
  const result: FounderPitchResult = {
    correctGreen: 0,
    correctRed: 0,
    missedSignals: 0,
    falseGreenFlags: 0,
    falseRedFlags: 0,
    wrongDirection: 0,
    meaningfulSignals: 0,
    correctSignals: 0,
  };

  for (const line of transcript.lines) {
    if (line.signalType !== "neutral") result.meaningfulSignals += 1;
    const state = getFounderReplayState(line, judgments[line.id]);
    if (state === "green-caught") result.correctGreen += 1;
    if (state === "red-caught") result.correctRed += 1;
    if (state === "missed-green" || state === "missed-red") result.missedSignals += 1;
    if (state === "false-green") result.falseGreenFlags += 1;
    if (state === "false-red") result.falseRedFlags += 1;
    if (state === "wrong-direction") result.wrongDirection += 1;
  }
  result.correctSignals = result.correctGreen + result.correctRed;
  return result;
}
