import type { FootballFieldScenario, LearnerRange, LearnerRanges, MethodologyId } from "./football-field-types";

const EPSILON = 1e-9;

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function snapToStep(value: number, axisMin: number, axisStep: number) {
  return axisMin + Math.round((value - axisMin) / axisStep) * axisStep;
}

export function normalizedValue(
  value: number,
  axisMin: number,
  axisMax: number,
) {
  return (clamp(value, axisMin, axisMax) - axisMin) / (axisMax - axisMin);
}

export function xForValue(
  value: number,
  axisMin: number,
  axisMax: number,
  chartLeft: number,
  chartWidth: number,
) {
  return chartLeft + normalizedValue(value, axisMin, axisMax) * chartWidth;
}

export function valueForX(
  x: number,
  axisMin: number,
  axisMax: number,
  axisStep: number,
  chartLeft: number,
  chartWidth: number,
) {
  const rawValue = axisMin + ((x - chartLeft) / chartWidth) * (axisMax - axisMin);
  return clamp(snapToStep(rawValue, axisMin, axisStep), axisMin, axisMax);
}

export function neutralInitialRange(scenario: FootballFieldScenario): LearnerRange {
  const axisSpan = scenario.axisMax - scenario.axisMin;
  const axisMid = scenario.axisMin + axisSpan / 2;
  const initialHalfWidth = axisSpan * 0.1;
  const low = clamp(
    snapToStep(axisMid - initialHalfWidth, scenario.axisMin, scenario.axisStep),
    scenario.axisMin,
    scenario.axisMax,
  );
  const high = clamp(
    snapToStep(axisMid + initialHalfWidth, scenario.axisMin, scenario.axisStep),
    scenario.axisMin,
    scenario.axisMax,
  );
  return { low: Math.min(low, high), high: Math.max(low, high) };
}

export function createNeutralRanges(scenario: FootballFieldScenario): LearnerRanges {
  const range = neutralInitialRange(scenario);
  return Object.fromEntries(
    scenario.methodologies.map((methodology) => [methodology.id, { ...range }]),
  ) as LearnerRanges;
}

export function updateRangeEndpoint(
  ranges: LearnerRanges,
  methodologyId: MethodologyId,
  endpoint: keyof LearnerRange,
  nextValue: number,
  scenario: FootballFieldScenario,
): LearnerRanges {
  const currentRange = ranges[methodologyId];
  const snappedValue = clamp(
    snapToStep(nextValue, scenario.axisMin, scenario.axisStep),
    scenario.axisMin,
    scenario.axisMax,
  );
  const nextRange = endpoint === "low"
    ? { low: Math.min(snappedValue, currentRange.high), high: currentRange.high }
    : { low: currentRange.low, high: Math.max(snappedValue, currentRange.low) };

  return { ...ranges, [methodologyId]: nextRange };
}

export function respectsAxisStep(value: number, scenario: FootballFieldScenario) {
  const steps = (value - scenario.axisMin) / scenario.axisStep;
  return Math.abs(steps - Math.round(steps)) < EPSILON;
}
