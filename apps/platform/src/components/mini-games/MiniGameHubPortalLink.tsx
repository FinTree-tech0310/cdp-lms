"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { getMiniGameReturnPath } from "@/lib/mini-game-return";

import styles from "./mini-game-hub-portal-link.module.css";

export function MiniGameHubPortalLink() {
  const returnPath = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      return () => window.removeEventListener("storage", onChange);
    },
    getMiniGameReturnPath,
    () => "/mini-games",
  );

  return (
    <Link href={returnPath} className={styles.link}>
      <span aria-hidden="true">←</span> {returnPath === "/mini-games" ? "Back to all games" : "Back to Careers"}
    </Link>
  );
}
