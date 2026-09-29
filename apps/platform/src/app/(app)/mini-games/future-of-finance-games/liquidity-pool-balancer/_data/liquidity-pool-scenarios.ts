import type { LiquidityPoolScenario } from "../_lib/liquidity-pool-types";

export const liquidityPoolScenarios: LiquidityPoolScenario[] = [
  {
    id: "lpb-1",
    treasuryContextNote:
      "A mid-sized DeFi protocol's treasury holds ETH and needs to cover this month's contributor payments in USDC.",
    executionRequirement:
      "The upcoming contributor-payment batch requires roughly 38,000-57,000 USDC. The treasury wants to raise enough to cover that obligation without taking materially more liquidity than needed or pushing price impact much beyond the mid-single digits.",
    tokenInLabel: "ETH",
    tokenOutLabel: "USDC",
    reserveIn: 500,
    reserveOut: 1000000,
    sliderMin: 1,
    sliderMax: 100,
    sliderStep: 1,
    startingSwapAmount: 10,
    idealSwapAmountMin: 20,
    idealSwapAmountMax: 30,
    feedbackByPosition: {
      belowTarget:
        "This trade keeps price impact relatively contained, but it does not convert enough ETH to raise the amount of USDC the treasury needs for the contributor-payment batch. Preserving execution quality only helps if the operational funding requirement is still met.",
      onTarget:
        "This trade balances the two objectives reasonably well. At this pool depth, swaps in this range raise approximately the amount of USDC needed while producing price impact of roughly 3.8-5.7%. The pool absorbs the trade without the treasury taking substantially more liquidity than the payment need requires.",
      aboveTarget:
        "This trade raises more USDC than the treasury needs and does so by consuming increasingly expensive liquidity deeper in the pool. Once the swap moves meaningfully beyond this range, the extra output comes with unnecessary additional price impact for a routine payment obligation.",
    },
  },
  {
    id: "lpb-2",
    treasuryContextNote:
      "A newer, smaller protocol needs to convert a portion of its native governance token into stablecoins to fund the first tranche of an upcoming grants program.",
    executionRequirement:
      "The first grants tranche requires roughly 2,300-3,600 USDC. This governance-token pool is shallow, so the team wants to fund the tranche without unnecessarily pushing execution impact beyond the high-single-digit range.",
    tokenInLabel: "GOV",
    tokenOutLabel: "USDC",
    reserveIn: 8000,
    reserveOut: 40000,
    sliderMin: 25,
    sliderMax: 2000,
    sliderStep: 25,
    startingSwapAmount: 100,
    idealSwapAmountMin: 500,
    idealSwapAmountMax: 800,
    feedbackByPosition: {
      belowTarget:
        "A smaller swap protects the pool from heavier price impact, but it leaves the grants treasury short of the USDC needed for this tranche. In a shallow pool, minimizing impact by simply trading too little does not solve the underlying funding requirement.",
      onTarget:
        "This is a defensible compromise for a shallow pool. Across this range the treasury raises approximately the required USDC, while price impact is already meaningful at roughly 5.9-9.1%. The important lesson is that even an operationally reasonable trade can move price noticeably when the available liquidity is limited.",
      aboveTarget:
        "This swap goes beyond the amount needed for the current grants tranche and consumes a larger fraction of an already shallow pool. Price impact rises quickly beyond this range, so executing additional size here would create unnecessary market impact. A larger future conversion may need to be split across venues or execution periods rather than forced through this one pool.",
    },
  },
  {
    id: "lpb-3",
    treasuryContextNote:
      "A large, well-established DeFi protocol is rebalancing part of its stablecoin treasury into ETH under a diversification plan approved by governance.",
    executionRequirement:
      "Governance wants this execution to acquire roughly 73-96 ETH. The selected pool is one of the deepest venues the protocol regularly uses, and the treasury would like to complete the allocation while keeping price impact around 4% or less rather than buying additional ETH simply because liquidity is available.",
    tokenInLabel: "USDC",
    tokenOutLabel: "ETH",
    reserveIn: 5000000,
    reserveOut: 2500,
    sliderMin: 5000,
    sliderMax: 400000,
    sliderStep: 5000,
    startingSwapAmount: 50000,
    idealSwapAmountMin: 150000,
    idealSwapAmountMax: 200000,
    feedbackByPosition: {
      belowTarget:
        "This execution benefits from very low price impact, but it does not acquire enough ETH to satisfy the governance-approved treasury allocation. Deep liquidity makes cautious execution easier, but trading materially below the required size still leaves the rebalance incomplete.",
      onTarget:
        "The depth of this pool comfortably supports the approved rebalance. Across this range the treasury receives roughly 73-96 ETH while price impact remains around 2.9-3.8%. This demonstrates why trade size has to be judged relative to available liquidity: an amount that would severely disrupt a shallow pool can be reasonable in a much deeper one.",
      aboveTarget:
        "The pool can technically absorb a larger trade, but the treasury would be purchasing beyond the amount required by the approved rebalance and accepting additional price impact without a corresponding execution need. Deep liquidity is not a reason to trade more than the mandate requires.",
    },
  },
  {
    id: "lpb-4",
    treasuryContextNote:
      "A protocol needs to unwind part of a yield-farming position, converting the underlying wBTC into DAI during a period of unusually thin market-wide liquidity.",
    executionRequirement:
      "The treasury needs to raise roughly 1.4-2.0 million DAI from this unwind. Liquidity is unusually thin, so some meaningful price impact is unavoidable, but the team wants to avoid pushing the trade materially beyond about 17% impact just to raise more DAI than the immediate obligation requires.",
    tokenInLabel: "wBTC",
    tokenOutLabel: "DAI",
    reserveIn: 300,
    reserveOut: 12000000,
    sliderMin: 2,
    sliderMax: 150,
    sliderStep: 2,
    startingSwapAmount: 10,
    idealSwapAmountMin: 40,
    idealSwapAmountMax: 60,
    feedbackByPosition: {
      belowTarget:
        "The smaller trade limits price impact, but it does not raise enough DAI to satisfy the treasury's immediate unwind requirement. In this unusually thin market, avoiding impact entirely is not realistic if the protocol still has to meet the funding need.",
      onTarget:
        "This range satisfies the treasury's immediate DAI requirement, but the execution cost is substantial because the trade represents a meaningful fraction of the pool's 300 wBTC reserve. Swapping 40-60 wBTC produces roughly 11.8-16.7% price impact in this simplified pool. The important comparison is the trade's size relative to available liquidity, not whether 40 or 60 tokens sounds large in isolation.",
      aboveTarget:
        "This trade pushes beyond the treasury's immediate funding requirement while consuming an even larger share of a thin pool. The additional DAI comes at rapidly increasing price impact, so forcing more size through this venue would be difficult to justify solely for the current obligation.",
    },
  },
];
