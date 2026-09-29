import type {
  ChartScenario,
  EarningsOutcome,
  ReportedQuarterResult,
} from "./read-the-chart-types";

const REPORTED_QUARTER_RESULTS: readonly ReportedQuarterResult[] = [
  "beat",
  "miss",
  "inline",
];

const EARNINGS_OUTCOMES: readonly EarningsOutcome[] = [
  "beatAndRaised",
  "beatAndCut",
  "missedAndRaised",
  "missedAndCut",
  "inlineNoSurprise",
];

const COMPATIBLE_OUTCOMES: Readonly<
  Record<ReportedQuarterResult, readonly EarningsOutcome[]>
> = {
  beat: ["beatAndRaised", "beatAndCut"],
  miss: ["missedAndRaised", "missedAndCut"],
  inline: ["inlineNoSurprise"],
};

function contentError(message: string): never {
  throw new Error(`Read the Chart content error: ${message}`);
}

function requireText(value: string, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    contentError(`${field} must be non-empty.`);
  }
}

export function validateChartScenarios(
  scenarios: readonly ChartScenario[],
): void {
  if (scenarios.length === 0) {
    contentError("at least one scenario is required.");
  }

  const scenarioIds = new Set<string>();

  for (const scenario of scenarios) {
    requireText(scenario.id, "scenario id");
    if (scenarioIds.has(scenario.id)) {
      contentError(`duplicate scenario id "${scenario.id}".`);
    }
    scenarioIds.add(scenario.id);

    const fieldPrefix = `scenario "${scenario.id}"`;
    requireText(scenario.companyContext, `${fieldPrefix} companyContext`);
    requireText(
      scenario.reportedQuarterNote,
      `${fieldPrefix} reportedQuarterNote`,
    );
    requireText(scenario.explanation, `${fieldPrefix} explanation`);
    requireText(
      scenario.movementDescriptionForScreenReaders,
      `${fieldPrefix} movementDescriptionForScreenReaders`,
    );

    if (
      !REPORTED_QUARTER_RESULTS.includes(scenario.reportedQuarterResult)
    ) {
      contentError(`${fieldPrefix} reportedQuarterResult is invalid.`);
    }

    if (!EARNINGS_OUTCOMES.includes(scenario.correctOutcome)) {
      contentError(`${fieldPrefix} correctOutcome is invalid.`);
    }

    if (
      !COMPATIBLE_OUTCOMES[scenario.reportedQuarterResult].includes(
        scenario.correctOutcome,
      )
    ) {
      contentError(
        `${fieldPrefix} reportedQuarterResult "${scenario.reportedQuarterResult}" is incompatible with correctOutcome "${scenario.correctOutcome}".`,
      );
    }

    if (scenario.pricePoints.length < 3) {
      contentError(`${fieldPrefix} must contain at least 3 price points.`);
    }

    const relativeDays = new Set<number>();
    let beforeEarningsCount = 0;
    let earningsDateCount = 0;
    let afterEarningsCount = 0;

    scenario.pricePoints.forEach((point, index) => {
      const pointPrefix = `${fieldPrefix}, price point ${index + 1}`;
      if (!Number.isFinite(point.relativeDay)) {
        contentError(`${pointPrefix} relativeDay must be finite.`);
      }
      if (!Number.isFinite(point.price)) {
        contentError(`${pointPrefix} price must be finite.`);
      }
      if (point.price <= 0) {
        contentError(`${pointPrefix} price must be greater than 0.`);
      }
      if (relativeDays.has(point.relativeDay)) {
        contentError(
          `${fieldPrefix} relativeDay values must be unique; duplicate ${point.relativeDay}.`,
        );
      }
      relativeDays.add(point.relativeDay);

      if (point.relativeDay < 0) beforeEarningsCount += 1;
      if (point.relativeDay === 0) earningsDateCount += 1;
      if (point.relativeDay > 0) afterEarningsCount += 1;
    });

    if (beforeEarningsCount === 0) {
      contentError(`${fieldPrefix} needs a price point before earnings.`);
    }
    if (earningsDateCount !== 1) {
      contentError(
        `${fieldPrefix} must contain exactly one price point at relativeDay 0.`,
      );
    }
    if (afterEarningsCount === 0) {
      contentError(`${fieldPrefix} needs a price point after earnings.`);
    }
  }
}
