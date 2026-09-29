import { isTriageAction } from "./triage-actions";
import type {
  FraudTriageResultSnapshot,
  FraudTriageScenarioSet,
  TransactionAssignments,
} from "./fraud-triage-types";

export function countUnassigned(
  scenario: FraudTriageScenarioSet,
  assignments: TransactionAssignments,
): number {
  return scenario.transactions.reduce(
    (count, transaction) => count + (isTriageAction(assignments[transaction.id]) ? 0 : 1),
    0,
  );
}

export function createTriageSnapshot(
  scenario: FraudTriageScenarioSet,
  assignments: TransactionAssignments,
): FraudTriageResultSnapshot | null {
  if (countUnassigned(scenario, assignments) !== 0) return null;

  return {
    scenarioId: scenario.id,
    setContext: scenario.setContext,
    transactions: scenario.transactions.map((transaction) => {
      const learnerAction = assignments[transaction.id];
      if (!isTriageAction(learnerAction)) throw new Error("A transaction is unassigned.");
      return {
        transactionId: transaction.id,
        signals: transaction.signals.map((signal) => ({ ...signal })),
        learnerAction,
        recommendedAction: transaction.recommendedAction,
        matched: learnerAction === transaction.recommendedAction,
        feedback: transaction.feedbackByAction[learnerAction],
      };
    }),
  };
}
