import type { Metadata } from "next";
import { MiniGameCardLink } from "@/components/mini-games/MiniGameCardLink";

import { MiniGameHubPortalLink } from "@/components/mini-games/MiniGameHubPortalLink";

import { PrivateWealthHubArt } from "./_components/PrivateWealthHubArt";
import styles from "./private-wealth-games.module.css";

export const metadata: Metadata = {
  title: "Private Wealth Mini-Games | Career Discovery Program",
  description: "Explore the judgment calls and client conversations behind private wealth advice.",
};

export default function PrivateWealthGamesPage() {
  return (
    <section className={styles.arena} aria-labelledby="private-wealth-games-title">
      <MiniGameHubPortalLink />
      <header className={styles.header}>
        <p className={styles.eyebrow}>Career Discovery Program</p>
        <h1 id="private-wealth-games-title" className={styles.title}>
          Private <span>Wealth</span>
        </h1>
        <p className={styles.intro}>
          Step into the client conversations behind long-term financial advice.
        </p>
      </header>

      <div className={styles.grid} aria-label="Private wealth mini-games">
        <MiniGameCardLink
          className={`${styles.gameCard} ${styles.dossierCard}`}
          href="/mini-games/private-wealth-games/client-dossier"
          aria-label="Client Dossier — Risk Mismatch"
        >
          <span className={styles.cardBadge}>Start here</span>
          <PrivateWealthHubArt game="client-dossier" />
          <span className={styles.cardCopy}>
            <span className={styles.cardCategory}>Client judgment</span>
            <span className={styles.cardTitle}>Client <em>Dossier</em></span>
            <span className={styles.cardDescription}>
              Read the request. Notice the life context. Decide how to respond.
            </span>
          </span>
        </MiniGameCardLink>

        <MiniGameCardLink
          className={`${styles.gameCard} ${styles.messageCard}`}
          href="/mini-games/private-wealth-games/would-you-push-back"
          aria-label="Would You Push Back?"
        >
          <PrivateWealthHubArt game="would-you-push-back" />
          <span className={styles.cardCopy}>
            <span className={styles.cardCategory}>Rapid advice</span>
            <span className={styles.cardTitle}>Would You <em>Push Back?</em></span>
            <span className={styles.cardDescription}>
              Read the message. Weigh the request. Decide how to respond.
            </span>
          </span>
        </MiniGameCardLink>

        <MiniGameCardLink
          className={`${styles.gameCard} ${styles.callCard}`}
          href="/mini-games/private-wealth-games/panic-call"
          aria-label="Panic Call"
        >
          <PrivateWealthHubArt game="panic-call" />
          <span className={styles.cardCopy}>
            <span className={styles.cardCategory}>Client under pressure</span>
            <span className={styles.cardTitle}>Panic <em>Call</em></span>
            <span className={styles.cardDescription}>
              Answer the call. Guide the conversation. Compare what happens next.
            </span>
          </span>
        </MiniGameCardLink>

        <MiniGameCardLink
          className={`${styles.gameCard} ${styles.rebalanceCard}`}
          href="/mini-games/private-wealth-games/rebalance-the-drift"
          aria-label="Rebalance the Drift"
        >
          <PrivateWealthHubArt game="rebalance-the-drift" />
          <span className={styles.cardCopy}>
            <span className={styles.cardCategory}>Portfolio allocation</span>
            <span className={styles.cardTitle}>Rebalance <em>the Drift</em></span>
            <span className={styles.cardDescription}>
              Adjust the portfolio. Track the live mix. Bring it back toward target.
            </span>
          </span>
        </MiniGameCardLink>

        <MiniGameCardLink
          className={`${styles.gameCard} ${styles.timelineCard}`}
          href="/mini-games/private-wealth-games/client-timeline"
          aria-label="Client Timeline"
        >
          <span className={styles.cardBadge}>Capstone</span>
          <PrivateWealthHubArt game="client-timeline" />
          <span className={styles.cardCopy}>
            <span className={styles.cardCategory}>Advice through time</span>
            <span className={styles.cardTitle}>Client <em>Timeline</em></span>
            <span className={styles.cardDescription}>
              Follow one client. Navigate three life moments. See the pattern in your advice.
            </span>
          </span>
        </MiniGameCardLink>
      </div>
      <p className={styles.note}>Best on desktop.</p>
    </section>
  );
}
