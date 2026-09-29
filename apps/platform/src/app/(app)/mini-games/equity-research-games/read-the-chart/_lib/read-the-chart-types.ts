export type EarningsOutcome =
  | "beatAndRaised"
  | "beatAndCut"
  | "missedAndRaised"
  | "missedAndCut"
  | "inlineNoSurprise";

export type ReportedQuarterResult = "beat" | "miss" | "inline";

export interface ChartPricePoint {
  relativeDay: number;
  price: number;
}

export interface ChartScenario {
  id: string;
  companyContext: string;
  reportedQuarterResult: ReportedQuarterResult;
  reportedQuarterNote: string;
  pricePoints: ChartPricePoint[];
  correctOutcome: EarningsOutcome;
  explanation: string;
  movementDescriptionForScreenReaders: string;
}

export interface EarningsOutcomeOption {
  id: EarningsOutcome;
  label: string;
}

export const EARNINGS_OUTCOMES: readonly EarningsOutcomeOption[] = [
  { id: "beatAndRaised", label: "Beat Expectations & Raised Guidance" },
  { id: "beatAndCut", label: "Beat Expectations & Cut Guidance" },
  { id: "missedAndRaised", label: "Missed Expectations & Raised Guidance" },
  { id: "missedAndCut", label: "Missed Expectations & Cut Guidance" },
  { id: "inlineNoSurprise", label: "Inline Results, No Real Surprise" },
];

const OUTCOME_LABELS = new Map(
  EARNINGS_OUTCOMES.map((outcome) => [outcome.id, outcome.label]),
);

export function getEarningsOutcomeLabel(outcome: EarningsOutcome): string {
  return OUTCOME_LABELS.get(outcome) ?? outcome;
}

export const REPORTED_QUARTER_LABELS: Readonly<
  Record<ReportedQuarterResult, string>
> = {
  beat: "Beat expectations",
  miss: "Missed expectations",
  inline: "In line with expectations",
};
