import Link from "next/link";

import type { EquityResearchGame } from "../_data/games";
import styles from "../equity-research-games.module.css";
import { EquityResearchHubArt } from "./EquityResearchHubArt";

interface EquityResearchGameCardProps {
  game: EquityResearchGame;
}

function CardContents({ game }: EquityResearchGameCardProps) {
  return (
    <>
      {game.badge ? (
        <span className={styles.cardBadge} aria-hidden="true">
          {game.badge}
        </span>
      ) : null}
      <EquityResearchHubArt gameId={game.id} />
      <span className={styles.cardCopy} aria-hidden="true">
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

export function EquityResearchGameCard({
  game,
}: EquityResearchGameCardProps) {
  const className = `${styles.gameCard} ${styles[`${game.tone}Card`]}`;

  if (game.status === "coming-soon" || !game.slug) {
    return (
      <article
        className={className}
        data-status="coming-soon"
        aria-label={`${game.title} — coming soon`}
      >
        <CardContents game={game} />
      </article>
    );
  }

  return (
    <Link
      href={`/mini-games/equity-research-games/${game.slug}`}
      className={className}
      aria-label={game.title}
    >
      <CardContents game={game} />
    </Link>
  );
}
