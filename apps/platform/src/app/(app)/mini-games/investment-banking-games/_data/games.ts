export type InvestmentBankingGameTone =
  | "orange"
  | "cream"
  | "indigo"
  | "lavender"
  | "ink";

export type InvestmentBankingGameSlug =
  | "the-comps-screen"
  | "counteroffer"
  | "bidding-war"
  | "football-field-builder"
  | "the-all-nighter";

export interface InvestmentBankingGame {
  slug: InvestmentBankingGameSlug;
  title: string;
  titleLines: readonly [string, string];
  category: string;
  description: string;
  tone: InvestmentBankingGameTone;
  status: "available" | "coming-soon";
  badge?: "START HERE";
}

export const INVESTMENT_BANKING_GAMES: readonly InvestmentBankingGame[] = [
  {
    slug: "the-comps-screen",
    title: "The Comps Screen",
    titleLines: ["The Comps", "Screen"],
    category: "Comparable companies",
    description: "Read the mandate. Screen the candidates. Build a defensible comp set.",
    tone: "orange",
    status: "available",
    badge: "START HERE",
  },
  {
    slug: "counteroffer",
    title: "Counteroffer",
    titleLines: ["Counter", "offer"],
    category: "Deal negotiation",
    description: "Work the terms. Read the response. Decide where to move next.",
    tone: "cream",
    status: "available",
  },
  {
    slug: "bidding-war",
    title: "Bidding War",
    titleLines: ["Bidding", "War"],
    category: "Auction strategy",
    description: "Track the process. Raise, hold, or walk as the field tightens.",
    tone: "indigo",
    status: "available",
  },
  {
    slug: "football-field-builder",
    title: "Football Field Builder",
    titleLines: ["Football Field", "Builder"],
    category: "Valuation ranges",
    description: "Build the ranges. Compare the methods. Read the valuation picture.",
    tone: "lavender",
    status: "available",
  },
  {
    slug: "the-all-nighter",
    title: "The All-Nighter",
    titleLines: ["The All-", "Nighter"],
    category: "Execution under pressure",
    description: "Triage the queue. Protect deadlines. Keep the deal team moving.",
    tone: "ink",
    status: "available",
  },
];
