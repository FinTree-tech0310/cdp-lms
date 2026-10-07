"use client";

import Link, { useLinkStatus } from "next/link";
import { useState, type ComponentProps } from "react";

import styles from "./mini-game-card-link.module.css";

type MiniGameCardLinkProps = Omit<ComponentProps<typeof Link>, "prefetch">;

function PendingIndicator() {
  const { pending } = useLinkStatus();

  return (
    <span className={styles.status} role="status" aria-live="polite" aria-atomic="true">
      {pending ? (
        <span className={styles.pending}>
          <span className={styles.spinner} aria-hidden="true" />
          Opening game…
        </span>
      ) : null}
    </span>
  );
}

export function MiniGameCardLink({
  children,
  className,
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...props
}: MiniGameCardLinkProps) {
  const [prefetchFullRoute, setPrefetchFullRoute] = useState(false);

  return (
    <Link
      {...props}
      className={`${className ?? ""} ${styles.link}`}
      // Keep automatic shell prefetching; fetch the full game on intent.
      prefetch={prefetchFullRoute ? true : null}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        setPrefetchFullRoute(true);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        setPrefetchFullRoute(true);
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event);
        setPrefetchFullRoute(true);
      }}
    >
      {children}
      <PendingIndicator />
    </Link>
  );
}
