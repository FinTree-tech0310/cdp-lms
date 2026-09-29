export type SwapRangePosition = "belowTarget" | "onTarget" | "aboveTarget";
export type SwapStatus = "onTarget" | "offTarget";
export type AdjustmentDirection = "increase" | "decrease" | "withinRange";

export interface SwapOutputs {
  amountOut: number;
  spotPriceBefore: number;
  effectivePrice: number;
  priceImpactPercent: number;
}

export interface LiquidityPoolScenario {
  id: string;
  treasuryContextNote: string;
  executionRequirement: string;
  tokenInLabel: string;
  tokenOutLabel: string;
  reserveIn: number;
  reserveOut: number;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  startingSwapAmount: number;
  idealSwapAmountMin: number;
  idealSwapAmountMax: number;
  feedbackByPosition: Record<SwapRangePosition, string>;
}

export interface LiquidityPoolResultSnapshot {
  scenarioId: string;
  treasuryContextNote: string;
  executionRequirement: string;
  tokenInLabel: string;
  tokenOutLabel: string;
  submittedSwapAmount: number;
  idealSwapAmountMin: number;
  idealSwapAmountMax: number;
  adjustmentDirection: AdjustmentDirection;
  outputs: SwapOutputs;
  swapStatus: SwapStatus;
  rangePosition: SwapRangePosition;
  selectedFeedback: string;
}
