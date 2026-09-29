import Link from "next/link";

import type { InvestmentBankingGame } from "../_data/games";
import styles from "../investment-banking-games.module.css";
import { InvestmentBankingHubArt } from "./InvestmentBankingHubArt";

interface InvestmentBankingGameCardProps {
  game: InvestmentBankingGame;
}

function CardContents({ game }: InvestmentBankingGameCardProps) {
  return (
    <>
      {game.badge ? <span className={styles.startBadge}>{game.badge}</span> : null}
      {game.status === "coming-soon" ? (
        <span className={styles.comingSoonBadge}>Coming soon</span>
      ) : null}
      <InvestmentBankingHubArt game={game.slug} />
      <span className={styles.cardCopy}>
        <span className={styles.cardCategory}>{game.category}</span>
        <span className={styles.cardTitle}>
          <span>{game.titleLines[0]}</span>
          <em>{game.titleLines[1]}</em>
        </span>
        <span className={styles.cardDescription}>{game.description}</span>
      </span>
    </>
  );
}

export function InvestmentBankingGameCard({ game }: InvestmentBankingGameCardProps) {
  const className = `${styles.gameCard} ${styles[`${game.tone}Card`]}`;

  if (game.status === "coming-soon") {
    return (
      <article
        className={className}
        data-game={game.slug}
        data-status="coming-soon"
        aria-label={`${game.title} — coming soon`}
      >
        <CardContents game={game} />
      </article>
    );
  }

  return (
    <Link
      href={`/mini-games/investment-banking-games/${game.slug}`}
      className={className}
      data-game={game.slug}
      aria-label={game.title}
    >
      <CardContents game={game} />
    </Link>
  );
}
