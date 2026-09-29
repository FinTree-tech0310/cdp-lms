import type { MathPuzzleScenario } from "./math-puzzle-scenarios";

type BurnScenarioInput = {
  id: string;
  startupName: string;
  rawInputs: MathPuzzleScenario["rawInputs"];
  netBurn: [string, string, string, string];
  runway: [string, string, string, string];
  burnMultiple: [string, string, string, string];
  verdict: string;
  verdictType: MathPuzzleScenario["verdictType"];
};

const buildBurnScenario = ({
  id,
  startupName,
  rawInputs,
  netBurn,
  runway,
  burnMultiple,
  verdict,
  verdictType,
}: BurnScenarioInput): MathPuzzleScenario => ({
  id,
  section: "burn-runway",
  startupName,
  rawInputs,
  slots: [
    {
      id: `${id}-net-burn`,
      label: "Net Burn",
      correctTileId: `${id}-net-burn-correct`,
      explanation: "Cash consumed after operating cash receipts during the measured period.",
      calculation: netBurn[3],
    },
    {
      id: `${id}-runway`,
      label: "Runway",
      correctTileId: `${id}-runway-correct`,
      explanation: "Estimated time before the company exhausts its cash at the current burn rate.",
      calculation: runway[3],
    },
    {
      id: `${id}-burn-multiple`,
      label: "Burn Multiple",
      correctTileId: `${id}-burn-multiple-correct`,
      explanation: "Compares net cash burned with net new recurring revenue created in the same period.",
      calculation: burnMultiple[3],
    },
  ],
  tilePool: [
    { id: `${id}-net-burn-correct`, label: netBurn[0] },
    { id: `${id}-net-burn-wrong-1`, label: netBurn[1] },
    { id: `${id}-net-burn-wrong-2`, label: netBurn[2] },
    { id: `${id}-runway-correct`, label: runway[0] },
    { id: `${id}-runway-wrong-1`, label: runway[1] },
    { id: `${id}-runway-wrong-2`, label: runway[2] },
    { id: `${id}-burn-multiple-correct`, label: burnMultiple[0] },
    { id: `${id}-burn-multiple-wrong-1`, label: burnMultiple[1] },
    { id: `${id}-burn-multiple-wrong-2`, label: burnMultiple[2] },
  ],
  verdict,
  verdictType,
});

export const ADDITIONAL_BURN_RUNWAY_SCENARIOS: readonly MathPuzzleScenario[] = [
  buildBurnScenario({
    id: "atlas-ops",
    startupName: "AtlasOps",
    rawInputs: [
      { label: "Cash Operating Expenses (quarter)", value: "$1.2M" },
      { label: "Cash Receipts (quarter)", value: "$600K" },
      { label: "Cash Balance", value: "$2.4M" },
      { label: "Net New ARR (quarter)", value: "$600K" },
    ],
    netBurn: ["$600K / quarter", "$1.2M / quarter", "$1.8M / quarter", "$1.2M - $600K = $600K per quarter"],
    runway: ["12 months", "4 months", "6 months", "$2.4M / ($600K / 3) = 12 months"],
    burnMultiple: ["1.0x", "2.0x", "0.5x", "$600K / $600K = 1.0x"],
    verdict: "The company has 12 months of runway and spends one dollar of net burn for each dollar of net new ARR. That gives it time to keep growing without unusually heavy cash consumption, though the burn profile still needs regular monitoring.",
    verdictType: "healthy",
  }),
  buildBurnScenario({
    id: "supply-sync",
    startupName: "SupplySync",
    rawInputs: [
      { label: "Cash Operating Expenses (quarter)", value: "$1.8M" },
      { label: "Cash Receipts (quarter)", value: "$900K" },
      { label: "Cash Balance", value: "$4.5M" },
      { label: "Net New ARR (quarter)", value: "$450K" },
    ],
    netBurn: ["$900K / quarter", "$1.8M / quarter", "$2.7M / quarter", "$1.8M - $900K = $900K per quarter"],
    runway: ["15 months", "5 months", "7.5 months", "$4.5M / ($900K / 3) = 15 months"],
    burnMultiple: ["2.0x", "4.0x", "0.5x", "$900K / $450K = 2.0x"],
    verdict: "Fifteen months of runway provides time to act, but the company burns two dollars for each dollar of net new ARR. Growth efficiency is workable rather than comfortable, so the next quarters should show whether scale improves it.",
    verdictType: "concerning",
  }),
  buildBurnScenario({
    id: "nano-works",
    startupName: "NanoWorks",
    rawInputs: [
      { label: "Cash Operating Expenses (quarter)", value: "$1.2M" },
      { label: "Cash Receipts (quarter)", value: "$300K" },
      { label: "Cash Balance", value: "$1.35M" },
      { label: "Net New ARR (quarter)", value: "$300K" },
    ],
    netBurn: ["$900K / quarter", "$1.2M / quarter", "$1.5M / quarter", "$1.2M - $300K = $900K per quarter"],
    runway: ["4.5 months", "1.5 months", "3.4 months", "$1.35M / ($900K / 3) = 4.5 months"],
    burnMultiple: ["3.0x", "4.0x", "1.0x", "$900K / $300K = 3.0x"],
    verdict: "Only 4.5 months of runway remain while the company burns three dollars for each dollar of net new ARR. Without a rapid financing or cost response, the cash deadline arrives before the growth engine has much room to improve.",
    verdictType: "unsustainable",
  }),
  buildBurnScenario({
    id: "field-pilot",
    startupName: "FieldPilot",
    rawInputs: [
      { label: "Cash Operating Expenses (quarter)", value: "$2.1M" },
      { label: "Cash Receipts (quarter)", value: "$1.2M" },
      { label: "Cash Balance", value: "$5.4M" },
      { label: "Net New ARR (quarter)", value: "$1.2M" },
    ],
    netBurn: ["$900K / quarter", "$2.1M / quarter", "$3.3M / quarter", "$2.1M - $1.2M = $900K per quarter"],
    runway: ["18 months", "6 months", "7.7 months", "$5.4M / ($900K / 3) = 18 months"],
    burnMultiple: ["0.75x", "1.75x", "1.33x", "$900K / $1.2M = 0.75x"],
    verdict: "The company has 18 months of runway and creates more net new ARR than it burns in cash over the quarter. That combination gives management meaningful operating flexibility, assuming the revenue gains persist.",
    verdictType: "healthy",
  }),
  buildBurnScenario({
    id: "care-mesh",
    startupName: "CareMesh",
    rawInputs: [
      { label: "Cash Operating Expenses (quarter)", value: "$1.05M" },
      { label: "Cash Receipts (quarter)", value: "$450K" },
      { label: "Cash Balance", value: "$1.8M" },
      { label: "Net New ARR (quarter)", value: "$240K" },
    ],
    netBurn: ["$600K / quarter", "$1.05M / quarter", "$1.5M / quarter", "$1.05M - $450K = $600K per quarter"],
    runway: ["9 months", "3 months", "5.1 months", "$1.8M / ($600K / 3) = 9 months"],
    burnMultiple: ["2.5x", "4.4x", "1.9x", "$600K / $240K = 2.5x"],
    verdict: "Nine months of runway creates a near-term financing clock, and a 2.5x burn multiple shows considerable cash consumption relative to added ARR. The company has time to respond, but not enough to ignore efficiency.",
    verdictType: "concerning",
  }),
  buildBurnScenario({
    id: "creator-stack",
    startupName: "CreatorStack",
    rawInputs: [
      { label: "Cash Operating Expenses (quarter)", value: "$600K" },
      { label: "Cash Receipts (quarter)", value: "$150K" },
      { label: "Cash Balance", value: "$900K" },
      { label: "Net New ARR (quarter)", value: "$150K" },
    ],
    netBurn: ["$450K / quarter", "$600K / quarter", "$750K / quarter", "$600K - $150K = $450K per quarter"],
    runway: ["6 months", "2 months", "4.5 months", "$900K / ($450K / 3) = 6 months"],
    burnMultiple: ["3.0x", "4.0x", "1.0x", "$450K / $150K = 3.0x"],
    verdict: "The company has six months of runway and spends three dollars of net burn for every dollar of net new ARR. Its current growth efficiency and cash horizon leave little protection against a missed plan.",
    verdictType: "unsustainable",
  }),
  buildBurnScenario({
    id: "grid-secure",
    startupName: "GridSecure",
    rawInputs: [
      { label: "Cash Operating Expenses (quarter)", value: "$2.4M" },
      { label: "Cash Receipts (quarter)", value: "$1.8M" },
      { label: "Cash Balance", value: "$4.8M" },
      { label: "Net New ARR (quarter)", value: "$1.2M" },
    ],
    netBurn: ["$600K / quarter", "$2.4M / quarter", "$4.2M / quarter", "$2.4M - $1.8M = $600K per quarter"],
    runway: ["24 months", "8 months", "6 months", "$4.8M / ($600K / 3) = 24 months"],
    burnMultiple: ["0.5x", "2.0x", "1.5x", "$600K / $1.2M = 0.5x"],
    verdict: "Twenty-four months of runway and a 0.5x burn multiple give the company a strong cash position relative to recurring-revenue creation. The long horizon also reduces pressure to raise on an unfavorable timetable.",
    verdictType: "healthy",
  }),
  buildBurnScenario({
    id: "retail-mind",
    startupName: "RetailMind",
    rawInputs: [
      { label: "Cash Operating Expenses (quarter)", value: "$1.5M" },
      { label: "Cash Receipts (quarter)", value: "$600K" },
      { label: "Cash Balance", value: "$1.8M" },
      { label: "Net New ARR (quarter)", value: "$225K" },
    ],
    netBurn: ["$900K / quarter", "$1.5M / quarter", "$2.1M / quarter", "$1.5M - $600K = $900K per quarter"],
    runway: ["6 months", "2 months", "3.6 months", "$1.8M / ($900K / 3) = 6 months"],
    burnMultiple: ["4.0x", "6.7x", "2.7x", "$900K / $225K = 4.0x"],
    verdict: "A six-month runway combines with four dollars of burn for every dollar of net new ARR. The company is consuming cash too quickly for the growth produced and needs a material change before the financing window closes.",
    verdictType: "unsustainable",
  }),
];
