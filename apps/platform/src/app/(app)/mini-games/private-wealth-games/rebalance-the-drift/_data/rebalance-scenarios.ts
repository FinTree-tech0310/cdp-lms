export type AssetClass =
  | "equities"
  | "fixedIncome"
  | "cash"
  | "alternatives";

export interface AssetClassAllocation {
  assetClass: AssetClass;
  label: string;
  currentPercent: number;
  targetPercent: number;
}

export interface RebalanceScenario {
  id: string;
  clientName: string;
  contextNote: string;
  allocations: AssetClassAllocation[];
  tolerancePercent: number;
  resultSummary: string;
}

export const REBALANCE_SCENARIOS: readonly RebalanceScenario[] = [
  {
    id: "rd-1",
    clientName: "Andrea Chen",
    contextNote:
      "A prolonged bull market pushed this portfolio well past its original growth allocation over the last two years.",
    allocations: [
      {
        assetClass: "equities",
        label: "Equities",
        currentPercent: 75,
        targetPercent: 55,
      },
      {
        assetClass: "fixedIncome",
        label: "Fixed Income",
        currentPercent: 12,
        targetPercent: 30,
      },
      {
        assetClass: "cash",
        label: "Cash",
        currentPercent: 5,
        targetPercent: 5,
      },
      {
        assetClass: "alternatives",
        label: "Alternatives",
        currentPercent: 8,
        targetPercent: 10,
      },
    ],
    tolerancePercent: 3,
    resultSummary:
      "This portfolio is now carrying meaningfully more market risk than Andrea originally agreed to — a downturn from here would hit far harder than her plan intended. Rebalancing means selling some of the equity gains while they're strong and moving that value into fixed income, locking in growth rather than simply assuming the recent run will continue.",
  },
  {
    id: "rd-2",
    clientName: "Thomas Reyes",
    contextNote:
      "A rough stretch for equities combined with a strong bond rally left this growth-oriented portfolio more conservative than intended.",
    allocations: [
      {
        assetClass: "equities",
        label: "Equities",
        currentPercent: 45,
        targetPercent: 65,
      },
      {
        assetClass: "fixedIncome",
        label: "Fixed Income",
        currentPercent: 40,
        targetPercent: 20,
      },
      {
        assetClass: "cash",
        label: "Cash",
        currentPercent: 5,
        targetPercent: 5,
      },
      {
        assetClass: "alternatives",
        label: "Alternatives",
        currentPercent: 10,
        targetPercent: 10,
      },
    ],
    tolerancePercent: 3,
    resultSummary:
      "Drift doesn't only move toward more risk — this portfolio drifted toward too little. Thomas is decades from retirement and built his plan around long-term growth, but this allocation is now underexposed to equities, which risks falling short of his actual goals even though it 'feels' safer today.",
  },
  {
    id: "rd-3",
    clientName: "Grace Whitfield",
    contextNote:
      "Dividends and contributions sat uninvested in cash for over a year instead of being reinvested per the original plan.",
    allocations: [
      {
        assetClass: "equities",
        label: "Equities",
        currentPercent: 50,
        targetPercent: 58,
      },
      {
        assetClass: "fixedIncome",
        label: "Fixed Income",
        currentPercent: 20,
        targetPercent: 27,
      },
      {
        assetClass: "cash",
        label: "Cash",
        currentPercent: 20,
        targetPercent: 5,
      },
      {
        assetClass: "alternatives",
        label: "Alternatives",
        currentPercent: 10,
        targetPercent: 10,
      },
    ],
    tolerancePercent: 3,
    resultSummary:
      "Nothing went wrong in the market here — the drift came entirely from inaction. Letting dividends and contributions pile up as cash instead of reinvesting them quietly drags down long-term returns, even though it never shows up as a visible 'loss' the way a market drop would.",
  },
  {
    id: "rd-4",
    clientName: "Marcus Ibe",
    contextNote:
      "A weak stretch for this client's alternative investments left that portion of the portfolio well below its intended weight, with everything else drifting proportionally higher to fill the gap.",
    allocations: [
      {
        assetClass: "equities",
        label: "Equities",
        currentPercent: 62,
        targetPercent: 55,
      },
      {
        assetClass: "fixedIncome",
        label: "Fixed Income",
        currentPercent: 26,
        targetPercent: 25,
      },
      {
        assetClass: "cash",
        label: "Cash",
        currentPercent: 5,
        targetPercent: 5,
      },
      {
        assetClass: "alternatives",
        label: "Alternatives",
        currentPercent: 7,
        targetPercent: 15,
      },
    ],
    tolerancePercent: 3,
    resultSummary:
      "Alternatives were included specifically because they don't move in lockstep with stocks and bonds — that's part of the diversification Marcus was counting on. Leaving this allocation substantially below target means the portfolio is no longer providing the mix originally intended. Rebalancing restores that exposure rather than allowing recent performance alone to determine the portfolio's structure.",
  },
  {
    id: "rd-5",
    clientName: "Helen Osei",
    contextNote:
      "Helen recently moved her planned retirement date up by three years. Her target allocation has been updated to reflect that — but her actual holdings haven't caught up yet.",
    allocations: [
      {
        assetClass: "equities",
        label: "Equities",
        currentPercent: 68,
        targetPercent: 45,
      },
      {
        assetClass: "fixedIncome",
        label: "Fixed Income",
        currentPercent: 22,
        targetPercent: 40,
      },
      {
        assetClass: "cash",
        label: "Cash",
        currentPercent: 5,
        targetPercent: 10,
      },
      {
        assetClass: "alternatives",
        label: "Alternatives",
        currentPercent: 5,
        targetPercent: 5,
      },
    ],
    tolerancePercent: 4,
    resultSummary:
      "This drift isn't about the market at all — it's about Helen's own plan changing faster than her portfolio has. With retirement now only a few years away instead of many, a market downturn hitting this still-aggressive allocation could seriously disrupt her actual timeline. Rebalancing here isn't fixing a mistake, it's catching the portfolio up to a decision Helen already made.",
  },
];
