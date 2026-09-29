import type { ReactNode } from "react";

/**
 * Every route under /mini-games (catalogue, hub pages, individual games)
 * renders inside this wrapper so the ported games get the typography the
 * original cdp-minigames app applied on <body> — Lato for copy, Rethink
 * Sans for headings — without touching the rest of the platform. The
 * catalogue opts back out with the `mini-games-catalog` class.
 */
export default function MiniGamesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="mini-games-scope">{children}</div>;
}
