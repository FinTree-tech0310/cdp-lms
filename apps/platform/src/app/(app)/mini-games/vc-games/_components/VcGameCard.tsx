import Link from "next/link";
import Image from "next/image";

import type { VcGame } from "../_data/games";
import styles from "../vc-games.module.css";

interface VcGameCardProps {
  game: VcGame;
}

export function VcGameCard({ game }: VcGameCardProps) {
  return (
    <Link
      href={`/mini-games/vc-games/${game.slug}`}
      className={`${styles.card} ${styles[game.tone]}`}
      data-game={game.slug}
      data-tier={game.tier}
      aria-label={game.title}
    >
      {game.badge ? <span className={styles.badge} aria-hidden="true">{game.badge}</span> : null}
      <span className={styles.cardArt} aria-hidden="true">
        <Image
          src={game.illustration}
          alt=""
          fill
          sizes="(max-width: 720px) 84vw, (max-width: 1080px) 42vw, 280px"
        />
      </span>
      <span className={styles.cardCopy} aria-hidden="true">
        <span className={styles.cardCategory}>{game.category}</span>
        <span className={styles.cardTitle}>
          <span>{game.titleLines[0]}</span>
          <span className={styles.cardTitleAccent}>{game.titleLines[1]}</span>
        </span>
      </span>
    </Link>
  );
}
