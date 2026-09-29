import { computeSwapOutputs } from "./compute-swap-outputs";
import type { LiquidityPoolResultSnapshot, LiquidityPoolScenario, SwapRangePosition } from "./liquidity-pool-types";

export function getSwapRangePosition(scenario: LiquidityPoolScenario, submittedSwapAmount: number): SwapRangePosition {
  if (submittedSwapAmount < scenario.idealSwapAmountMin) return "belowTarget";
  if (submittedSwapAmount > scenario.idealSwapAmountMax) return "aboveTarget";
  return "onTarget";
}

export function createLiquidityPoolResultSnapshot(
  scenario: LiquidityPoolScenario,
  submittedSwapAmount: number,
): LiquidityPoolResultSnapshot {
  const rangePosition = getSwapRangePosition(scenario, submittedSwapAmount);
  const adjustmentDirection = rangePosition === "belowTarget"
    ? "increase"
    : rangePosition === "aboveTarget"
      ? "decrease"
      : "withinRange";
  return {
    scenarioId: scenario.id,
    treasuryContextNote: scenario.treasuryContextNote,
    executionRequirement: scenario.executionRequirement,
    tokenInLabel: scenario.tokenInLabel,
    tokenOutLabel: scenario.tokenOutLabel,
    submittedSwapAmount,
    idealSwapAmountMin: scenario.idealSwapAmountMin,
    idealSwapAmountMax: scenario.idealSwapAmountMax,
    adjustmentDirection,
    outputs: { ...computeSwapOutputs(scenario.reserveIn, scenario.reserveOut, submittedSwapAmount) },
    swapStatus: rangePosition === "onTarget" ? "onTarget" : "offTarget",
    rangePosition,
    selectedFeedback: scenario.feedbackByPosition[rangePosition],
  };
}
