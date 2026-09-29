import type { LiquidityPoolScenario } from "./liquidity-pool-types";

export const liquidityPoolTestFixture: LiquidityPoolScenario = {
  id: "test-1",
  treasuryContextNote: "TEST DATA — placeholder treasury context only.",
  executionRequirement:
    "TEST — The protocol treasury needs to raise at least 40,000 USDC in this swap for contributor payments. The treasury wants to avoid taking substantially more liquidity than necessary and would prefer to keep price impact below roughly 5.5%.",
  tokenInLabel: "ETH",
  tokenOutLabel: "USDC",
  reserveIn: 500,
  reserveOut: 1000000,
  sliderMin: 1,
  sliderMax: 100,
  sliderStep: 1,
  startingSwapAmount: 10,
  idealSwapAmountMin: 21,
  idealSwapAmountMax: 29,
  feedbackByPosition: {
    belowTarget:
      "TEST DATA — placeholder feedback explaining that the submitted trade preserves lower price impact but does not satisfy enough of the treasury's required USDC funding need.",
    onTarget:
      "TEST DATA — placeholder feedback explaining that the submitted trade raises the required treasury liquidity while keeping execution impact within the intended range.",
    aboveTarget:
      "TEST DATA — placeholder feedback explaining that the submitted trade takes more liquidity than the treasury needs and creates unnecessary additional price impact.",
  },
};
