"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import type { CompsCandidate } from "../_data/comps-scenarios";
import type { CandidatePlacement } from "../_lib/comps-screen-state";
import styles from "../the-comps-screen.module.css";

interface CompsCandidateCardProps {
  candidate: CompsCandidate;
  placement: CandidatePlacement;
  locked?: boolean;
  onMove: (candidateId: string, placement: CandidatePlacement) => void;
}

const PLACEMENT_LABELS: Record<CandidatePlacement, string> = {
  unscreened: "Awaiting decision",
  include: "Current placement: Include",
  exclude: "Current placement: Exclude",
};

export function CompsCandidateCard({
  candidate,
  placement,
  locked = false,
  onMove,
}: CompsCandidateCardProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
  } = useDraggable({
    id: `candidate:${candidate.id}`,
    data: { candidateId: candidate.id },
    disabled: locked,
  });

  return (
    <article
      ref={setNodeRef}
      className={styles.candidateCard}
      data-dragging={isDragging}
      data-placement={placement}
      style={{ transform: CSS.Translate.toString(transform) }}
    >
      <div className={styles.candidateHeading}>
        <div>
          <p className={styles.candidateStatus}>{PLACEMENT_LABELS[placement]}</p>
          <h3>{candidate.name}</h3>
        </div>
        <button
          ref={setActivatorNodeRef}
          type="button"
          className={styles.dragHandle}
          data-candidate-focus={candidate.id}
          disabled={locked}
          aria-label={`Drag ${candidate.name} to another screening zone`}
          {...listeners}
          {...attributes}
        >
          <span aria-hidden="true">⠿</span>
          <span>Drag</span>
        </button>
      </div>

      <dl className={styles.candidateFacts}>
        <div>
          <dt>Industry</dt>
          <dd>{candidate.industry}</dd>
        </div>
        <div>
          <dt>Revenue</dt>
          <dd>{candidate.revenueSize}</dd>
        </div>
        <div>
          <dt>Geography</dt>
          <dd>{candidate.geography}</dd>
        </div>
      </dl>
      <p className={styles.businessModel}>{candidate.businessModelLine}</p>

      {!locked ? (
        <div className={styles.assignmentActions} aria-label={`Assign ${candidate.name}`}>
          {placement !== "include" ? (
            <button type="button" onClick={() => onMove(candidate.id, "include")}>
              {placement === "exclude" ? "Move to Include" : "Include"}
            </button>
          ) : null}
          {placement !== "exclude" ? (
            <button type="button" onClick={() => onMove(candidate.id, "exclude")}>
              {placement === "include" ? "Move to Exclude" : "Exclude"}
            </button>
          ) : null}
          {placement !== "unscreened" ? (
            <button type="button" onClick={() => onMove(candidate.id, "unscreened")}>
              Return to Unscreened
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
