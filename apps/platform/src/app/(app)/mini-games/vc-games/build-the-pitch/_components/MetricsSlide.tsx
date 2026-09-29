"use client";

import { useDroppable } from "@dnd-kit/core";

import type {
  MathPuzzleScenario,
  MetricSlot,
  MetricTile,
} from "../_data/math-puzzle-scenarios";
import { DEAL_ROOM_SECTION_LABELS } from "../_data/math-puzzle-scenarios";
import styles from "../build-the-pitch.module.css";
import { DraggableMetricTile } from "./MetricTilePool";

interface MetricSlotCardProps {
  slot: MetricSlot;
  tile?: MetricTile;
  correctTile?: MetricTile;
  submitted: boolean;
  selectedTileId: string | null;
  onSelectTile: (tileId: string) => void;
  onPlaceSelected: (slotId: string) => void;
}

function MetricSlotCard({
  slot,
  tile,
  correctTile,
  submitted,
  selectedTileId,
  onSelectTile,
  onPlaceSelected,
}: MetricSlotCardProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot:${slot.id}`,
    data: { slotId: slot.id },
    disabled: submitted,
  });
  const isCorrect = submitted && tile?.id === slot.correctTileId;
  const isIncorrect = submitted && !isCorrect;
  const canPlaceSelected = Boolean(selectedTileId) && selectedTileId !== tile?.id && !submitted;

  return (
    <div
      ref={setNodeRef}
      className={styles.metricSlot}
      data-over={isOver}
      data-filled={Boolean(tile)}
      data-result={isCorrect ? "correct" : isIncorrect ? "incorrect" : undefined}
      data-click-ready={canPlaceSelected}
    >
      <span className={styles.slotLabel}>{slot.label}</span>
      {tile ? (
        <DraggableMetricTile
          tile={tile}
          sourceSlotId={slot.id}
          disabled={submitted}
          selected={selectedTileId === tile.id}
          onSelect={onSelectTile}
        />
      ) : (
        <span className={styles.dropHint}>Drop value here</span>
      )}
      {submitted ? (
        <div className={styles.slotFeedback} aria-live="polite">
          <p className={styles.answerFeedback}>
            {isCorrect ? (
              <>
                Correct <span aria-hidden="true">✓</span>
              </>
            ) : (
              <>
                Correct answer: <strong>{correctTile?.label ?? "—"}</strong>
              </>
            )}
          </p>
          <div className={styles.metricTeaching}>
            <p className={styles.metricCalculation}>{slot.calculation}</p>
            <p className={styles.metricExplanation}>{slot.explanation}</p>
          </div>
        </div>
      ) : null}
      {canPlaceSelected ? (
        <button
          type="button"
          className={styles.slotClickTarget}
          aria-label={`Place selected value in ${slot.label}`}
          onClick={() => onPlaceSelected(slot.id)}
        />
      ) : null}
    </div>
  );
}

interface MetricsSlideProps {
  scenario: MathPuzzleScenario;
  tilesById: ReadonlyMap<string, MetricTile>;
  placements: Readonly<Record<string, string>>;
  submitted: boolean;
  selectedTileId: string | null;
  onSelectTile: (tileId: string) => void;
  onPlaceSelected: (slotId: string) => void;
  workspacePart?: string;
}

export function MetricsSlide({
  scenario,
  tilesById,
  placements,
  submitted,
  selectedTileId,
  onSelectTile,
  onPlaceSelected,
  workspacePart,
}: MetricsSlideProps) {
  return (
    <section
      className={styles.metricsSlide}
      aria-labelledby="metrics-slide-title"
      data-build-workspace-part={workspacePart}
    >
      <header className={styles.slideHeader}>
        <div>
          <p>Investor metrics</p>
          <h2 id="metrics-slide-title">{scenario.startupName}</h2>
        </div>
        <span>{DEAL_ROOM_SECTION_LABELS[scenario.section]}</span>
      </header>

      <div className={styles.slotGrid}>
        {scenario.slots.map((slot) => (
          <MetricSlotCard
            key={slot.id}
            slot={slot}
            tile={tilesById.get(placements[slot.id])}
            correctTile={tilesById.get(slot.correctTileId)}
            submitted={submitted}
            selectedTileId={selectedTileId}
            onSelectTile={onSelectTile}
            onPlaceSelected={onPlaceSelected}
          />
        ))}
      </div>

      <footer className={styles.slideFooter}>
        <span>CDP / The Deal Room</span>
        <span>01</span>
      </footer>
    </section>
  );
}
