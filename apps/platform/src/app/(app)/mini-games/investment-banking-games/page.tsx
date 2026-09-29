import type { Metadata } from "next";

import { MiniGameHubPortalLink } from "@/components/mini-games/MiniGameHubPortalLink";

import { InvestmentBankingGameCard } from "./_components/InvestmentBankingGameCard";
import { INVESTMENT_BANKING_GAMES } from "./_data/games";
import styles from "./investment-banking-games.module.css";

export const metadata: Metadata = {
  title: "Investment Banking Mini-Games | Career Discovery Program",
  description:
    "Practice the screens, negotiations, valuations, and execution work behind investment banking.",
};

export default function InvestmentBankingGamesPage() {
  return (
    <section className={styles.arena} aria-labelledby="investment-banking-games-title">
      <MiniGameHubPortalLink />
      <header className={styles.header}>
        <p className={styles.eyebrow}>Career Discovery Program</p>
        <h1 id="investment-banking-games-title" className={styles.title}>
          Investment <span>Banking</span>
        </h1>
        <p className={styles.intro}>
          Step into the screens, negotiations, valuations, and deadlines behind a live deal.
        </p>
        <p className={styles.supporting}>5 mini-games. Different parts of the deal process.</p>
      </header>

      <div className={styles.grid} aria-label="Investment banking mini-games">
        {INVESTMENT_BANKING_GAMES.map((game) => (
          <InvestmentBankingGameCard key={game.slug} game={game} />
        ))}
      </div>
      <p className={styles.note}>Best on desktop.</p>
    </section>
  );
}
