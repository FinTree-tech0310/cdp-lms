export type EquityResearchGameTone =
  | "orange"
  | "white"
  | "indigo"
  | "lavender"
  | "ink";

export interface EquityResearchGame {
  id: "game-1" | "game-2" | "game-3" | "game-4" | "game-5";
  slug?: "read-the-chart" | "thesis-defense" | "the-analyst-note-editor" | "model-update-reflex" | "variant-perception";
  title: string;
  titleLines: readonly [string, string];
  category: string;
  description: string;
  tone: EquityResearchGameTone;
  status: "available" | "coming-soon";
  badge?: "START HERE" | "COMING SOON";
}

export const EQUITY_RESEARCH_GAMES: readonly EquityResearchGame[] = [
  {
    id: "game-1",
    slug: "read-the-chart",
    title: "Read the Chart",
    titleLines: ["Read the", "Chart"],
    category: "Earnings interpretation",
    description:
      "Read the reported quarter. Study the market reaction. Judge what changed in expectations.",
    tone: "orange",
    status: "available",
  },
  {
    id: "game-2",
    slug: "thesis-defense",
    title: "Thesis Defense",
    titleLines: ["Thesis", "Defense"],
    category: "Investment judgment",
    description:
      "Defend a published view through four challenges from a skeptical portfolio manager.",
    tone: "white",
    status: "available",
  },
  {
    id: "game-3",
    slug: "the-analyst-note-editor",
    title: "The Analyst Note Editor",
    titleLines: ["Analyst Note", "Editor"],
    category: "Research integrity",
    description:
      "Review a draft research note and challenge claims that go beyond the evidence.",
    tone: "indigo",
    status: "available",
  },
  {
    id: "game-4",
    slug: "model-update-reflex",
    title: "Model Update Reflex",
    titleLines: ["Model Update", "Reflex"],
    category: "Forecast judgment",
    description: "Revise forecast assumptions and follow their effects through the model.",
    tone: "lavender",
    status: "available",
  },
  {
    id: "game-5",
    slug: "variant-perception",
    title: "Variant Perception",
    titleLines: ["Variant", "Perception"],
    category: "Publication judgment",
    description: "Decide how strongly to publish a differentiated view, then explore what followed.",
    tone: "ink",
    status: "available",
  },
];
