export type VcGameTone =
  | "orange"
  | "white"
  | "indigo"
  | "ink"
  | "lavender"
  | "cream";

export type VcGameTier = "featured" | "core" | "strategic";

export interface VcGame {
  slug: string;
  title: string;
  titleLines: readonly [string, string];
  category: string;
  illustration: string;
  tone: VcGameTone;
  tier: VcGameTier;
  badge?: "START HERE" | "TOP GAME";
}

export const VC_GAMES: readonly VcGame[] = [
  {
    slug: "deal-speed-round",
    title: "Deal Speed Round",
    titleLines: ["Deal Speed", "Round"],
    category: "Fast Decisions",
    illustration: "/images/vc-games/deal-speed-round.png",
    tone: "orange",
    tier: "featured",
    badge: "START HERE",
  },
  {
    slug: "founder-interrogation",
    title: "Founder Interrogation",
    titleLines: ["Founder", "Interrogation"],
    category: "Pitch Judgment",
    illustration: "/images/vc-games/founder-interrogation.png",
    tone: "ink",
    tier: "featured",
    badge: "TOP GAME",
  },
  {
    slug: "the-pitch-sprint",
    title: "The Pitch Sprint",
    titleLines: ["The Pitch", "Sprint"],
    category: "Pattern Recognition",
    illustration: "/images/vc-games/the-pitch-sprint.png",
    tone: "white",
    tier: "core",
  },
  {
    slug: "build-the-pitch",
    title: "Build the Pitch",
    titleLines: ["Build the", "Pitch"],
    category: "Startup Math",
    illustration: "/images/vc-games/build-the-pitch.png",
    tone: "indigo",
    tier: "core",
  },
  {
    slug: "investor-match",
    title: "Investor Match",
    titleLines: ["Investor", "Match"],
    category: "Founder Trade-offs",
    illustration: "/images/vc-games/investor-match.png",
    tone: "cream",
    tier: "strategic",
  },
  {
    slug: "the-reference-call",
    title: "The Reference Call",
    titleLines: ["The Reference", "Call"],
    category: "Diligence Signals",
    illustration: "/images/vc-games/the-reference-call.png",
    tone: "lavender",
    tier: "strategic",
  },
];

export function getVcGame(slug: string): VcGame | undefined {
  return VC_GAMES.find((game) => game.slug === slug);
}
