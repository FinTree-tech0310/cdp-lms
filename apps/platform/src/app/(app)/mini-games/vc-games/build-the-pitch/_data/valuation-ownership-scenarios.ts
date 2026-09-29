import type { MathPuzzleScenario } from "./math-puzzle-scenarios";

type ValuationScenarioInput = {
  id: string;
  startupName: string;
  rawInputs: MathPuzzleScenario["rawInputs"];
  postMoney: [string, string, string, string];
  investorOwnership: [string, string, string, string];
  founderOwnership: [string, string, string, string];
  verdict: string;
  verdictType: MathPuzzleScenario["verdictType"];
};

const buildValuationScenario = ({
  id,
  startupName,
  rawInputs,
  postMoney,
  investorOwnership,
  founderOwnership,
  verdict,
  verdictType,
}: ValuationScenarioInput): MathPuzzleScenario => ({
  id,
  section: "valuation-ownership",
  startupName,
  rawInputs,
  slots: [
    {
      id: `${id}-post-money`,
      label: "Post-money Valuation",
      correctTileId: `${id}-post-money-correct`,
      explanation: "The company valuation immediately after adding the new investment.",
      calculation: postMoney[3],
    },
    {
      id: `${id}-investor-ownership`,
      label: "Investor Ownership",
      correctTileId: `${id}-investor-ownership-correct`,
      explanation: "The new investor's share of the post-money company value.",
      calculation: investorOwnership[3],
    },
    {
      id: `${id}-founder-ownership`,
      label: "Founder Ownership After Round",
      correctTileId: `${id}-founder-ownership-correct`,
      explanation: "The founder's remaining ownership after the new investor receives their stake.",
      calculation: founderOwnership[3],
    },
  ],
  tilePool: [
    { id: `${id}-post-money-correct`, label: postMoney[0] },
    { id: `${id}-post-money-wrong-1`, label: postMoney[1] },
    { id: `${id}-post-money-wrong-2`, label: postMoney[2] },
    { id: `${id}-investor-ownership-correct`, label: investorOwnership[0] },
    { id: `${id}-investor-ownership-wrong-1`, label: investorOwnership[1] },
    { id: `${id}-investor-ownership-wrong-2`, label: investorOwnership[2] },
    { id: `${id}-founder-ownership-correct`, label: founderOwnership[0] },
    { id: `${id}-founder-ownership-wrong-1`, label: founderOwnership[1] },
    { id: `${id}-founder-ownership-wrong-2`, label: founderOwnership[2] },
  ],
  verdict,
  verdictType,
});

export const ADDITIONAL_VALUATION_OWNERSHIP_SCENARIOS: readonly MathPuzzleScenario[] = [
  buildValuationScenario({
    id: "seed-spring",
    startupName: "SeedSpring",
    rawInputs: [
      { label: "Pre-money Valuation", value: "$12M" },
      { label: "New Investment", value: "$3M" },
      { label: "Founder Ownership Before Round", value: "70%" },
      { label: "Other Existing Ownership Before Round", value: "30%" },
    ],
    postMoney: ["$15M", "$12M", "$9M", "$12M + $3M = $15M"],
    investorOwnership: ["20%", "25%", "16.7%", "$3M / $15M = 20%"],
    founderOwnership: ["56%", "50%", "70%", "70% * (1 - 20%) = 56%"],
    verdict: "The new investor receives 20% while the founders retain 56% after the round. The financing adds meaningful capital without removing founder majority ownership, although all existing holders absorb proportional dilution.",
    verdictType: "healthy",
  }),
  buildValuationScenario({
    id: "orbit-health",
    startupName: "OrbitHealth",
    rawInputs: [
      { label: "Pre-money Valuation", value: "$18M" },
      { label: "New Investment", value: "$2M" },
      { label: "Founder Ownership Before Round", value: "75%" },
      { label: "Other Existing Ownership Before Round", value: "25%" },
    ],
    postMoney: ["$20M", "$18M", "$16M", "$18M + $2M = $20M"],
    investorOwnership: ["10%", "11.1%", "8%", "$2M / $20M = 10%"],
    founderOwnership: ["67.5%", "65%", "75%", "75% * (1 - 10%) = 67.5%"],
    verdict: "The round sells 10% of the post-money company and leaves founders with 67.5%. Dilution is relatively limited for the capital raised, provided the valuation is supported by the company's stage and traction.",
    verdictType: "healthy",
  }),
  buildValuationScenario({
    id: "factory-ai",
    startupName: "FactoryAI",
    rawInputs: [
      { label: "Pre-money Valuation", value: "$6M" },
      { label: "New Investment", value: "$4M" },
      { label: "Founder Ownership Before Round", value: "85%" },
      { label: "Other Existing Ownership Before Round", value: "15%" },
    ],
    postMoney: ["$10M", "$6M", "$2M", "$6M + $4M = $10M"],
    investorOwnership: ["40%", "66.7%", "28.6%", "$4M / $10M = 40%"],
    founderOwnership: ["51%", "45%", "68%", "85% * (1 - 40%) = 51%"],
    verdict: "The investor receives 40% in a single round, reducing founder ownership from 85% to 51%. The company gains substantial capital, but the ownership cost leaves very little founder-majority cushion for future dilution.",
    verdictType: "unsustainable",
  }),
  buildValuationScenario({
    id: "market-fox",
    startupName: "MarketFox",
    rawInputs: [
      { label: "Pre-money Valuation", value: "$15M" },
      { label: "New Investment", value: "$5M" },
      { label: "Founder Ownership Before Round", value: "60%" },
      { label: "Other Existing Ownership Before Round", value: "40%" },
    ],
    postMoney: ["$20M", "$15M", "$10M", "$15M + $5M = $20M"],
    investorOwnership: ["25%", "33.3%", "20%", "$5M / $20M = 25%"],
    founderOwnership: ["45%", "35%", "60%", "60% * (1 - 25%) = 45%"],
    verdict: "The new investor owns 25%, and founder ownership falls from 60% to 45%. The check may fund a meaningful step forward, but founders no longer hold a majority on ownership alone and should examine governance terms alongside dilution.",
    verdictType: "concerning",
  }),
  buildValuationScenario({
    id: "lab-link",
    startupName: "LabLink",
    rawInputs: [
      { label: "Pre-money Valuation", value: "$9M" },
      { label: "New Investment", value: "$1M" },
      { label: "Founder Ownership Before Round", value: "90%" },
      { label: "Other Existing Ownership Before Round", value: "10%" },
    ],
    postMoney: ["$10M", "$9M", "$8M", "$9M + $1M = $10M"],
    investorOwnership: ["10%", "11.1%", "9%", "$1M / $10M = 10%"],
    founderOwnership: ["81%", "80%", "90%", "90% * (1 - 10%) = 81%"],
    verdict: "The round gives the investor 10% and leaves founders with 81%. Ownership remains concentrated with the founding team, although the smaller capital injection must still be sufficient to reach the next value-creating milestone.",
    verdictType: "healthy",
  }),
  buildValuationScenario({
    id: "route-spark",
    startupName: "RouteSpark",
    rawInputs: [
      { label: "Pre-money Valuation", value: "$4M" },
      { label: "New Investment", value: "$4M" },
      { label: "Founder Ownership Before Round", value: "80%" },
      { label: "Other Existing Ownership Before Round", value: "20%" },
    ],
    postMoney: ["$8M", "$4M", "$0", "$4M + $4M = $8M"],
    investorOwnership: ["50%", "100%", "33.3%", "$4M / $8M = 50%"],
    founderOwnership: ["40%", "30%", "80%", "80% * (1 - 50%) = 40%"],
    verdict: "The new investor receives half the company, and founder ownership drops from 80% to 40%. Although the check doubles the post-money value, the round creates severe dilution and materially changes the ownership balance.",
    verdictType: "unsustainable",
  }),
  buildValuationScenario({
    id: "crew-works",
    startupName: "CrewWorks",
    rawInputs: [
      { label: "Pre-money Valuation", value: "$21M" },
      { label: "New Investment", value: "$7M" },
      { label: "Founder Ownership Before Round", value: "65%" },
      { label: "Other Existing Ownership Before Round", value: "35%" },
    ],
    postMoney: ["$28M", "$21M", "$14M", "$21M + $7M = $28M"],
    investorOwnership: ["25%", "33.3%", "20%", "$7M / $28M = 25%"],
    founderOwnership: ["48.75%", "40%", "65%", "65% * (1 - 25%) = 48.75%"],
    verdict: "The investor takes 25%, leaving founders with 48.75%. The round provides a substantial check, but founder ownership moves just below 50%, making future dilution and governance structure especially important.",
    verdictType: "concerning",
  }),
  buildValuationScenario({
    id: "data-harbor",
    startupName: "DataHarbor",
    rawInputs: [
      { label: "Pre-money Valuation", value: "$10M" },
      { label: "New Investment", value: "$10M" },
      { label: "Founder Ownership Before Round", value: "72%" },
      { label: "Other Existing Ownership Before Round", value: "28%" },
    ],
    postMoney: ["$20M", "$10M", "$0", "$10M + $10M = $20M"],
    investorOwnership: ["50%", "100%", "33.3%", "$10M / $20M = 50%"],
    founderOwnership: ["36%", "22%", "72%", "72% * (1 - 50%) = 36%"],
    verdict: "The investor receives 50%, reducing founder ownership from 72% to 36%. The capital is large relative to the pre-money valuation, but the resulting dilution leaves the founders with a clear minority before any future rounds.",
    verdictType: "unsustainable",
  }),
];
