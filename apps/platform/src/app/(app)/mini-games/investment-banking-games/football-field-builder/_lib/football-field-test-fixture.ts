import type { FootballFieldScenario } from "./football-field-types";

/** Test-only fixture; excluded from the learner-facing scenario rotation. */
export const footballFieldTestScenario: FootballFieldScenario = {
  id: "test-1", targetCompanyName: "Test Target Co (TEST DATA — placeholder only)", dealContextNote: "TEST DATA — placeholder deal context only.", axisMin: 20, axisMax: 80, axisStep: 1, axisUnit: "$ per share",
  methodologies: [
    { id: "dcf", label: "Discounted Cash Flow", analystEvidence: "TEST DATA — placeholder DCF evidence only.", referenceLow: 42, referenceHigh: 54, toleranceAmount: 3 },
    { id: "comps", label: "Comparable Companies", analystEvidence: "TEST DATA — placeholder comparable-companies evidence only.", referenceLow: 38, referenceHigh: 48, toleranceAmount: 3 },
    { id: "precedentTransactions", label: "Precedent Transactions", analystEvidence: "TEST DATA — placeholder precedent-transactions evidence only.", referenceLow: 46, referenceHigh: 58, toleranceAmount: 3 },
  ], actualDealPrice: 50, resultSummary: "TEST DATA — placeholder result summary only.",
};
