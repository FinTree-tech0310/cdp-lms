import type { Metadata } from "next";

import { MiniGameHubPortalLink } from "@/components/mini-games/MiniGameHubPortalLink";

import { FutureFinanceGameCard } from "./_components/FutureFinanceGameCard";
import { FUTURE_FINANCE_GAMES } from "./_data/games";
import styles from "./future-of-finance-games.module.css";

export const metadata: Metadata = {
  title: "Future of Finance Mini-Games | Career Discovery Program",
  description: "Explore the professional decisions behind the frontier of finance.",
};

export default function FutureOfFinanceGamesPage() {
  return (
    <main className={styles.arena} aria-labelledby="future-finance-games-title">
      <MiniGameHubPortalLink />
      <header className={styles.header}>
        <p className={styles.eyebrow}>Career Discovery Program</p>
        <h1 id="future-finance-games-title" className={styles.title}>
          Future of <span>Finance</span>
        </h1>
        <p className={styles.intro}>
          Explore the decisions shaping payments, digital markets, DeFi, and systematic trading.
        </p>
        <p className={styles.supporting}>Five mini-games across the frontier of finance.</p>
      </header>
      <div className={styles.grid} aria-label="Future of finance mini-games">
        {FUTURE_FINANCE_GAMES.map((game, index) => (
          <FutureFinanceGameCard key={game.slug} game={game} index={index} />
        ))}
      </div>
      <p className={styles.note}>Best on desktop.</p>
    </main>
  );
}
