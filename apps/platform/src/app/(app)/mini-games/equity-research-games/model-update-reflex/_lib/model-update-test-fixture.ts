import type { ModelUpdateScenario } from "./model-update-types";

export const MODEL_UPDATE_TEST_FIXTURE: ModelUpdateScenario = {
  id: "test-1",
  triggerEvent: "TEST DATA — placeholder trigger event only.",
  financialUnit: "$M",
  priorPeriodActuals: { revenue: 500, opex: 300 },
  assumptions: [
    {
      id: "revenueGrowthRate", label: "Revenue Growth Rate", unit: "%",
      min: -10, max: 20, step: 0.5, startingValue: 10, referenceValue: 4, toleranceAmount: 1,
      revisionEvidence: "TEST DATA — placeholder evidence for the revenue revision only.",
      reasoning: "TEST DATA — placeholder reasoning only.",
    },
    {
      id: "grossMarginPercent", label: "Gross Margin", unit: "%",
      min: 20, max: 60, step: 0.5, startingValue: 45, referenceValue: 42, toleranceAmount: 1,
      revisionEvidence: "TEST DATA — placeholder evidence for the gross-margin revision only.",
      reasoning: "TEST DATA — placeholder reasoning only.",
    },
    {
      id: "opexGrowthRate", label: "Opex Growth Rate", unit: "%",
      min: -10, max: 20, step: 0.5, startingValue: 8, referenceValue: 8, toleranceAmount: 1,
      revisionEvidence: "TEST DATA — placeholder evidence for the operating-expense revision only.",
      reasoning: "TEST DATA — placeholder reasoning only.",
    },
  ],
  resultSummary: "TEST DATA — placeholder result summary only.",
};
