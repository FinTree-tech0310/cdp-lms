import type { Metadata } from "next";

import { MiniGameHubPortalLink } from "@/components/mini-games/MiniGameHubPortalLink";

import { VcGameCard } from "./_components/VcGameCard";
import { VC_GAMES } from "./_data/games";
import styles from "./vc-games.module.css";

export const metadata: Metadata = {
  title: "The Deal Room | Career Discovery Program",
  description: "Explore venture capital mini-games and put your instincts to work.",
};

export default function VcGamesPage() {
  return (
    <section className={styles.arena} aria-labelledby="deal-room-title">
      <MiniGameHubPortalLink />
      <header className={styles.header}>
        <p className={styles.eyebrow}>Career Discovery Program</p>
        <h1 id="deal-room-title" className={styles.logo}>
          <span>The</span> Deal Room
        </h1>
        <p className={styles.intro}>Pick a challenge. Trust your instincts.</p>
        <p className={styles.supporting}>6 mini-games. Different parts of the VC job.</p>
      </header>

      <div className={styles.grid} aria-label="Venture capital mini-games">
        {VC_GAMES.map((game) => (
          <VcGameCard key={game.slug} game={game} />
        ))}
      </div>
      <p className={styles.desktopNote}>Best on desktop.</p>
    </section>
  );
}
