import { computeSwapOutputs } from "./compute-swap-outputs";
import { hasSelectableValueInRange, isSliderValueReachable } from "./swap-slider-grid";
import type { LiquidityPoolScenario } from "./liquidity-pool-types";

const feedbackKeys = ["belowTarget", "onTarget", "aboveTarget"] as const;

function fail(message: string): never {
  throw new Error(`Liquidity Pool Balancer content error: ${message}`);
}

function nonblank(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function positiveFinite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function validateLiquidityPoolScenarios(value: unknown): asserts value is LiquidityPoolScenario[] {
  if (!Array.isArray(value) || value.length === 0) fail("At least one scenario is required.");
  const ids = new Set<string>();
  for (const raw of value) {
    if (!raw || typeof raw !== "object") fail("Every scenario must be an object.");
    const scenario = raw as Record<string, unknown>;
    if (!nonblank(scenario.id)) fail("Scenario ID is required.");
    if (ids.has(scenario.id)) fail(`Duplicate scenario ID: ${scenario.id}.`);
    ids.add(scenario.id);
    for (const field of ["treasuryContextNote", "executionRequirement", "tokenInLabel", "tokenOutLabel"]) {
      if (!nonblank(scenario[field])) fail(`${scenario.id} needs nonblank ${field}.`);
    }
    for (const field of ["reserveIn", "reserveOut", "sliderMin", "sliderMax", "sliderStep", "startingSwapAmount"]) {
      if (!positiveFinite(scenario[field])) fail(`${scenario.id} needs positive finite ${field}.`);
    }
    const s = scenario as unknown as LiquidityPoolScenario;
    if (s.sliderMax <= s.sliderMin) fail(`${s.id} sliderMax must exceed sliderMin.`);
    if (s.startingSwapAmount < s.sliderMin || s.startingSwapAmount > s.sliderMax) {
      fail(`${s.id} startingSwapAmount is outside the slider bounds.`);
    }
    if (!isSliderValueReachable(s, s.startingSwapAmount)) {
      fail(`${s.id} startingSwapAmount is not selectable on the slider step grid.`);
    }
    if (!positiveFinite(s.idealSwapAmountMin) || !positiveFinite(s.idealSwapAmountMax)) {
      fail(`${s.id} needs finite positive ideal range bounds.`);
    }
    if (s.idealSwapAmountMin > s.idealSwapAmountMax
      || s.idealSwapAmountMin < s.sliderMin || s.idealSwapAmountMax > s.sliderMax) {
      fail(`${s.id} ideal range must be ordered and inside the slider bounds.`);
    }
    if (!hasSelectableValueInRange(s, s.idealSwapAmountMin, s.idealSwapAmountMax)) {
      fail(`${s.id} ideal range contains no slider-selectable value.`);
    }
    if (!s.feedbackByPosition || typeof s.feedbackByPosition !== "object" || Array.isArray(s.feedbackByPosition)) {
      fail(`${s.id} needs feedbackByPosition.`);
    }
    const actualKeys = Object.keys(s.feedbackByPosition);
    if (actualKeys.length !== feedbackKeys.length || actualKeys.some((key) => !feedbackKeys.includes(key as typeof feedbackKeys[number]))) {
      fail(`${s.id} feedbackByPosition must contain exactly belowTarget, onTarget, and aboveTarget.`);
    }
    for (const key of feedbackKeys) {
      if (!nonblank(s.feedbackByPosition[key])) fail(`${s.id} needs nonblank ${key} feedback.`);
    }
    for (const amount of [s.startingSwapAmount, s.idealSwapAmountMin, s.idealSwapAmountMax, s.sliderMax]) {
      const outputs = computeSwapOutputs(s.reserveIn, s.reserveOut, amount);
      if (!Object.values(outputs).every(Number.isFinite)) fail(`${s.id} has nonfinite AMM outputs.`);
    }
  }
}
