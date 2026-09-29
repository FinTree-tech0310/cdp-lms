import Link from "next/link";

import type { FutureFinanceGame } from "../_data/games";
import { FutureFinanceCardArt } from "./FutureFinanceCardArt";
import styles from "../future-of-finance-games.module.css";

export function FutureFinanceGameCard({ game, index }: { game: FutureFinanceGame; index: number }) {
  const content = (
    <>
      {!game.available ? <span className={styles.cardBadge}>Coming soon</span> : null}
      <FutureFinanceCardArt art={game.art} />
      <span className={styles.cardCopy}>
        <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.cardTitle}>{game.title}</span>
        <span className={styles.cardDomain}>{game.domain}</span>
      </span>
      {game.available ? <span className={styles.cardArrow} aria-hidden="true">↗</span> : null}
    </>
  );

  const className = `${styles.gameCard} ${styles[`card${index + 1}`]}`;
  return game.available ? (
    <Link className={className} href={`/mini-games/future-of-finance-games/${game.slug}`} aria-label={game.title}>
      {content}
    </Link>
  ) : (
    <article className={className} aria-label={`${game.title} — Coming soon`}>
      {content}
    </article>
  );
}
