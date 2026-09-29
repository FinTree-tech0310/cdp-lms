import type { Metadata } from "next";

import { MiniGameHubPortalLink } from "@/components/mini-games/MiniGameHubPortalLink";

import { EquityResearchGameCard } from "./_components/EquityResearchGameCard";
import { EQUITY_RESEARCH_GAMES } from "./_data/games";
import styles from "./equity-research-games.module.css";

export const metadata: Metadata = {
  title: "Equity Research Mini-Games | Career Discovery Program",
  description:
    "Practice the evidence reading and analytical judgment behind equity research.",
};

export default function EquityResearchGamesPage() {
  return (
    <main
      className={styles.arena}
      aria-labelledby="equity-research-games-title"
    >
      <MiniGameHubPortalLink />
      <header className={styles.header}>
        <p className={styles.eyebrow}>Career Discovery Program</p>
        <h1 id="equity-research-games-title" className={styles.title}>
          Equity <span>Research</span>
        </h1>
        <p className={styles.intro}>
          Read the evidence, separate results from expectations, and practice
          the judgment behind an analyst&apos;s view.
        </p>
        <p className={styles.supporting}>
          5 mini-games. Different parts of the analyst&apos;s job.
        </p>
      </header>

      <div className={styles.grid} aria-label="Equity research mini-games">
        {EQUITY_RESEARCH_GAMES.map((game) => (
          <EquityResearchGameCard key={game.id} game={game} />
        ))}
      </div>

      <p className={styles.note}>Best on desktop.</p>
    </main>
  );
}
