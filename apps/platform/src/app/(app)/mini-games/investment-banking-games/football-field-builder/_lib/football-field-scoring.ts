import type {
  FootballFieldScenario,
  LearnerRanges,
  MethodologyStatus,
  SubmittedFootballFieldSnapshot,
  ValuationMethodology,
} from "./football-field-types";

export function getMethodologyStatus(
  methodology: ValuationMethodology,
  learnerRange: { low: number; high: number },
): MethodologyStatus {
  return Math.abs(learnerRange.low - methodology.referenceLow) <= methodology.toleranceAmount
    && Math.abs(learnerRange.high - methodology.referenceHigh) <= methodology.toleranceAmount
    ? "on-target"
    : "needs-adjustment";
}

export function createFootballFieldSnapshot(
  scenario: FootballFieldScenario,
  ranges: LearnerRanges,
): SubmittedFootballFieldSnapshot {
  const snapshotRanges = Object.fromEntries(
    scenario.methodologies.map((methodology) => [
      methodology.id,
      Object.freeze({ ...ranges[methodology.id] }),
    ]),
  ) as LearnerRanges;
  const statuses = Object.fromEntries(
    scenario.methodologies.map((methodology) => [
      methodology.id,
      getMethodologyStatus(methodology, snapshotRanges[methodology.id]),
    ]),
  ) as SubmittedFootballFieldSnapshot["statuses"];
  const values = Object.values(snapshotRanges);
  const combinedLow = Math.min(...values.map((range) => range.low));
  const combinedHigh = Math.max(...values.map((range) => range.high));

  return Object.freeze({
    ranges: Object.freeze(snapshotRanges),
    statuses: Object.freeze(statuses),
    combinedLow,
    combinedHigh,
    dealPriceCaptured:
      scenario.actualDealPrice >= combinedLow && scenario.actualDealPrice <= combinedHigh,
  });
}
