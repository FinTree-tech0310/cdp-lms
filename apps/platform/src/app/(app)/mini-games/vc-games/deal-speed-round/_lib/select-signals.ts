import type { DealSignal } from "../_data/signals";

export const SIGNALS_PER_SESSION = 8;
export const RECENT_SIGNAL_LIMIT = 16;

export function selectSessionSignals(
  pool: readonly DealSignal[],
  recentSignalIds: readonly string[],
  random: () => number = Math.random,
): DealSignal[] {
  if (pool.length < SIGNALS_PER_SESSION) {
    throw new Error(`Deal Speed Round requires at least ${SIGNALS_PER_SESSION} signals.`);
  }

  const recentIds = new Set(recentSignalIds);
  const unseenSignals = pool.filter((signal) => !recentIds.has(signal.id));
  const selectionPool = unseenSignals.length >= SIGNALS_PER_SESSION ? unseenSignals : pool;
  const shuffled = [...selectionPool];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, SIGNALS_PER_SESSION);
}

export function mergeRecentSignalIds(
  previousIds: readonly string[],
  currentIds: readonly string[],
): string[] {
  const combined = [...previousIds, ...currentIds];
  const seen = new Set<string>();
  const latestUniqueIds: string[] = [];

  for (let index = combined.length - 1; index >= 0; index -= 1) {
    const id = combined[index];
    if (seen.has(id)) continue;

    seen.add(id);
    latestUniqueIds.unshift(id);
  }

  return latestUniqueIds.slice(-RECENT_SIGNAL_LIMIT);
}
