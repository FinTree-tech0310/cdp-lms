import { isTriageAction, TRIAGE_ACTIONS } from "./triage-actions";
import type { FraudTriageScenarioSet } from "./fraud-triage-types";

function fail(message: string): never {
  throw new Error(`Fraud Signal Triage content error: ${message}`);
}

function requireText(value: unknown, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0) fail(`${field} must be non-empty.`);
}

export function validateTriageScenarios(scenarios: readonly FraudTriageScenarioSet[]): void {
  if (!Array.isArray(scenarios) || scenarios.length === 0) fail("At least one scenario set is required.");
  const scenarioIds = new Set<string>();
  for (const scenario of scenarios) {
    if (!scenario || typeof scenario !== "object") fail("Invalid scenario set.");
    requireText(scenario.id, "Scenario ID");
    if (scenarioIds.has(scenario.id)) fail(`Duplicate scenario ID: ${scenario.id}.`);
    scenarioIds.add(scenario.id);
    requireText(scenario.setContext, `${scenario.id} setContext`);
    if (!Array.isArray(scenario.transactions) || scenario.transactions.length === 0) fail(`${scenario.id} needs at least one transaction.`);
    const transactionIds = new Set<string>();
    for (const transaction of scenario.transactions) {
      if (!transaction || typeof transaction !== "object") fail(`${scenario.id} has an invalid transaction.`);
      requireText(transaction.id, `${scenario.id} transaction ID`);
      if (transactionIds.has(transaction.id)) fail(`${scenario.id} has duplicate transaction ID: ${transaction.id}.`);
      transactionIds.add(transaction.id);
      if (!Array.isArray(transaction.signals) || transaction.signals.length === 0) fail(`${scenario.id}/${transaction.id} needs at least one signal.`);
      for (const [index, signal] of transaction.signals.entries()) {
        if (!signal || typeof signal !== "object") fail(`${scenario.id}/${transaction.id} has an invalid signal.`);
        requireText(signal.label, `${scenario.id}/${transaction.id} signal ${index + 1} label`);
        requireText(signal.value, `${scenario.id}/${transaction.id} signal ${index + 1} value`);
      }
      if (!isTriageAction(transaction.recommendedAction)) fail(`${scenario.id}/${transaction.id} has an invalid recommendedAction.`);
      if ("reasoning" in transaction) fail(`${scenario.id}/${transaction.id} has legacy reasoning; use feedbackByAction only.`);
      const feedback = transaction.feedbackByAction;
      if (!feedback || typeof feedback !== "object" || Array.isArray(feedback)) {
        fail(`${scenario.id}/${transaction.id} needs feedbackByAction for all three actions.`);
      }
      const feedbackKeys = Object.keys(feedback);
      if (feedbackKeys.length !== TRIAGE_ACTIONS.length || feedbackKeys.some((key) => !isTriageAction(key))) {
        fail(`${scenario.id}/${transaction.id} feedbackByAction must have exactly approve, stepUpVerify, and blockEscalate.`);
      }
      for (const action of TRIAGE_ACTIONS) {
        requireText(feedback[action], `${scenario.id}/${transaction.id} feedbackByAction.${action}`);
      }
    }
  }
}
