"use client";

import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

import type { CandidatePlacement } from "../_lib/comps-screen-state";
import styles from "../the-comps-screen.module.css";

interface CompsDropZoneProps {
  placement: CandidatePlacement;
  title: string;
  instruction: string;
  symbol: string;
  count: number;
  locked?: boolean;
  children: ReactNode;
}

export function CompsDropZone({
  placement,
  title,
  instruction,
  symbol,
  count,
  locked = false,
  children,
}: CompsDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `zone:${placement}`,
    data: { placement },
    disabled: locked,
  });

  return (
    <section
      ref={setNodeRef}
      className={styles.dropZone}
      data-zone={placement}
      data-over={isOver}
      aria-labelledby={`${placement}-zone-title`}
    >
      <div className={styles.zoneHeading}>
        <span className={styles.zoneSymbol} aria-hidden="true">{symbol}</span>
        <div>
          <div className={styles.zoneTitleLine}>
            <h2 id={`${placement}-zone-title`}>{title}</h2>
            <span>{count}</span>
          </div>
          <p>{instruction}</p>
        </div>
      </div>
      <div className={styles.zoneCards}>
        {count > 0 ? children : (
          <p className={styles.emptyZone}>Drop a company here or use its assignment buttons.</p>
        )}
      </div>
    </section>
  );
}
