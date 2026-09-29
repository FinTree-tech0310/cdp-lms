import Image from "next/image";

import styles from "../private-wealth-games.module.css";

type HubArtGame =
  | "client-dossier"
  | "would-you-push-back"
  | "panic-call"
  | "rebalance-the-drift"
  | "client-timeline";

const HUB_ART: Record<HubArtGame, string> = {
  "client-dossier": "/images/private-wealth-games/client-dossier-hub-v2.png",
  "would-you-push-back": "/images/private-wealth-games/would-you-push-back-hub-v2.png",
  "panic-call": "/images/private-wealth-games/panic-call-hub-v2.png",
  "rebalance-the-drift": "/images/private-wealth-games/rebalance-the-drift-hub-v2.png",
  "client-timeline": "/images/private-wealth-games/client-timeline-hub-v2.png",
};

interface PrivateWealthHubArtProps {
  game: HubArtGame;
  placement?: "card" | "entry";
}

export function PrivateWealthHubArt({
  game,
  placement = "card",
}: PrivateWealthHubArtProps) {
  return (
    <span
      className={placement === "entry" ? styles.entryArt : styles.cardArt}
      data-game={game}
      aria-hidden="true"
    >
      <Image
        src={HUB_ART[game]}
        alt=""
        fill
        sizes={
          placement === "entry"
            ? "(max-width: 620px) 44vw, 210px"
            : "(max-width: 620px) 62vw, (max-width: 900px) 32vw, 210px"
        }
      />
    </span>
  );
}
