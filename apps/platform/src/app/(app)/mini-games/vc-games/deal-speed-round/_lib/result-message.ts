import type { DealChoiceCounts, DealDecision } from "./deal-speed-round-state";

const FALLBACK_MESSAGE_COUNT = 3;

export interface DealSpeedResultSummary {
  decisions: readonly DealDecision[];
  finalStreak: number;
  bestStreak: number;
  timeoutCount: number;
  choiceCounts: DealChoiceCounts;
  isNewBestStreak: boolean;
}

export type DealSpeedMessageTier =
  | "new-best"
  | "perfect"
  | "heavy-timeouts"
  | "heavy-maybe"
  | "all-pass"
  | "all-fund"
  | "fast-average"
  | "fallback";

export interface DealSpeedResultMessage {
  message: string;
  tier: DealSpeedMessageTier;
}

export function chooseNextFallbackMessageIndex(
  previousIndex: number,
  random: () => number = Math.random,
): number {
  const availableIndexes = Array.from(
    { length: FALLBACK_MESSAGE_COUNT },
    (_, index) => index,
  ).filter((index) => index !== previousIndex);

  return availableIndexes[Math.floor(random() * availableIndexes.length)];
}

export function getDealSpeedResultMessage(
  summary: DealSpeedResultSummary,
  fallbackMessageIndex: number,
): DealSpeedResultMessage {
  if (summary.isNewBestStreak) {
    return {
      tier: "new-best",
      message: `New personal best — ${summary.bestStreak} in a row.`,
    };
  }

  if (summary.timeoutCount === 0) {
    return {
      tier: "perfect",
      message: "Zero hesitation. You answered every single one.",
    };
  }

  if (summary.timeoutCount >= 3) {
    return {
      tier: "heavy-timeouts",
      message: `${summary.timeoutCount} signals slipped past you. Speed comes with reps.`,
    };
  }

  if (summary.choiceCounts.maybe >= 4) {
    return {
      tier: "heavy-maybe",
      message: `You hedged on ${summary.choiceCounts.maybe} of 8. Real VCs rarely get that luxury.`,
    };
  }

  if (summary.timeoutCount === 0 && summary.choiceCounts.fund === 0) {
    return {
      tier: "all-pass",
      message: "Not one Fund this round. Cautious, or just a rough batch?",
    };
  }

  if (summary.timeoutCount === 0 && summary.choiceCounts.pass === 0) {
    return {
      tier: "all-fund",
      message: "You funded every single signal. Bold — or reckless?",
    };
  }

  const averageResponseTimeMs =
    summary.decisions.reduce((total, decision) => total + decision.responseTimeMs, 0) /
    summary.decisions.length;

  if (summary.timeoutCount === 0 && averageResponseTimeMs < 2_000) {
    const upperBoundSeconds = Math.min(2, Math.floor(averageResponseTimeMs / 100) / 10 + 0.1);
    return {
      tier: "fast-average",
      message: `Fast and clean. Average call: under ${upperBoundSeconds.toFixed(1)} seconds.`,
    };
  }

  const fallbackMessages = [
    `Round complete. ${summary.finalStreak}-signal streak this time.`,
    "8 calls made. Let's see if the next round beats this.",
    `Solid round. Your streak: ${summary.finalStreak}.`,
  ] as const;
  const safeFallbackIndex =
    fallbackMessageIndex >= 0 && fallbackMessageIndex < fallbackMessages.length
      ? fallbackMessageIndex
      : 0;

  return { tier: "fallback", message: fallbackMessages[safeFallbackIndex] };
}
