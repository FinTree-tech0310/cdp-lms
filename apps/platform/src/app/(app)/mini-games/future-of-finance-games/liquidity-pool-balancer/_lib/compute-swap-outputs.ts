import type { SwapOutputs } from "./liquidity-pool-types";

export function computeSwapOutputs(
  reserveIn: number,
  reserveOut: number,
  swapAmountIn: number,
): SwapOutputs {
  const amountOut = (reserveOut * swapAmountIn) / (reserveIn + swapAmountIn);
  const spotPriceBefore = reserveOut / reserveIn;
  const effectivePrice = amountOut / swapAmountIn;
  const priceImpactPercent = ((spotPriceBefore - effectivePrice) / spotPriceBefore) * 100;
  return { amountOut, spotPriceBefore, effectivePrice, priceImpactPercent };
}
