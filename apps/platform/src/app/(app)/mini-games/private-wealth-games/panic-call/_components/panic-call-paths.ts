import type { PanicCallScenario } from "../_data/panic-call-scenarios";
import type { PanicCallPath } from "../_lib/panic-call-state";

export const PANIC_CALL_PATHS: readonly PanicCallPath[] = [
  "decline",
  "hold-and-reassure",
  "partial-rebalance",
  "execute-sell",
];

export const PANIC_CALL_PATH_LABELS: Record<PanicCallPath, string> = {
  decline: "Decline the Call",
  "hold-and-reassure": "Hold and Reassure",
  "partial-rebalance": "Partial Defensive Rebalance",
  "execute-sell": "Execute the Sell as Asked",
};

export function getPanicCallOutcome(
  scenario: PanicCallScenario,
  path: PanicCallPath,
): string {
  switch (path) {
    case "decline":
      return scenario.declineOutcome;
    case "hold-and-reassure":
      return scenario.responses.holdAndReassure.outcome;
    case "partial-rebalance":
      return scenario.responses.partialRebalance.outcome;
    case "execute-sell":
      return scenario.responses.executeSell.outcome;
  }
}
