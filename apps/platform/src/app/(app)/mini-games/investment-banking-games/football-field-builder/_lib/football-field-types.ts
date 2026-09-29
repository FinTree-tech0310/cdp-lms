export type MethodologyId = "dcf" | "comps" | "precedentTransactions";

export interface ValuationMethodology {
  id: MethodologyId;
  label: string;
  analystEvidence: string;
  referenceLow: number;
  referenceHigh: number;
  toleranceAmount: number;
}

export interface FootballFieldScenario {
  id: string;
  targetCompanyName: string;
  dealContextNote: string;
  axisMin: number;
  axisMax: number;
  axisStep: number;
  axisUnit: string;
  methodologies: ValuationMethodology[];
  actualDealPrice: number;
  resultSummary: string;
}

export interface LearnerRange {
  low: number;
  high: number;
}

export type LearnerRanges = Record<MethodologyId, LearnerRange>;

export type MethodologyStatus = "on-target" | "needs-adjustment";

export interface SubmittedFootballFieldSnapshot {
  readonly ranges: LearnerRanges;
  readonly statuses: Record<MethodologyId, MethodologyStatus>;
  readonly combinedLow: number;
  readonly combinedHigh: number;
  readonly dealPriceCaptured: boolean;
}
