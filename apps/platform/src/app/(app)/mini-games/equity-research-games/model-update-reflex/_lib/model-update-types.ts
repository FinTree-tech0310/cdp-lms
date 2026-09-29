export const ASSUMPTION_IDS = [
  "revenueGrowthRate", "grossMarginPercent", "opexGrowthRate",
] as const;
export type AssumptionId = (typeof ASSUMPTION_IDS)[number];
export type AssumptionValues = Record<AssumptionId, number>;

export interface AssumptionDriver {
  id: AssumptionId;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  startingValue: number;
  referenceValue: number;
  toleranceAmount: number;
  revisionEvidence: string;
  reasoning: string;
}

export interface PriorPeriodActuals { revenue: number; opex: number }
export interface ModelUpdateScenario {
  id: string;
  triggerEvent: string;
  financialUnit: string;
  priorPeriodActuals: PriorPeriodActuals;
  assumptions: AssumptionDriver[];
  resultSummary: string;
}

export interface ModelOutputs {
  readonly projectedRevenue: number;
  readonly projectedGrossProfit: number;
  readonly projectedOpex: number;
  readonly projectedEBITDA: number;
}
export interface AssumptionReviewRecord {
  readonly id: AssumptionId;
  readonly label: string;
  readonly unit: string;
  readonly min: number;
  readonly step: number;
  readonly startingValue: number;
  readonly submittedValue: number;
  readonly referenceValue: number;
  readonly toleranceAmount: number;
  readonly status: "onTarget" | "needsAdjustment";
  readonly reasoning: string;
}
export interface ModelUpdateResultSnapshot {
  readonly scenarioId: string;
  readonly submittedValues: Readonly<AssumptionValues>;
  readonly assumptionReviews: readonly AssumptionReviewRecord[];
  readonly originalOutputs: ModelOutputs;
  readonly learnerOutputs: ModelOutputs;
  readonly referenceOutputs: ModelOutputs;
  readonly financialUnit: string;
  readonly resultSummary: string;
}
