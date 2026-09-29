"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import type { MetricTile } from "../_data/math-puzzle-scenarios";
import styles from "../build-the-pitch.module.css";

interface DraggableMetricTileProps {
  tile: MetricTile;
  sourceSlotId?: string;
  disabled?: boolean;
  selected?: boolean;
  onSelect?: (tileId: string) => void;
}

export function DraggableMetricTile({
  tile,
  sourceSlotId,
  disabled = false,
  selected = false,
  onSelect,
}: DraggableMetricTileProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({
    id: `tile:${tile.id}`,
    data: { tileId: tile.id, sourceSlotId },
    disabled,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={styles.metricTile}
      data-dragging={isDragging}
      data-selected={selected}
      disabled={disabled}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      aria-pressed={selected}
      aria-label={`${tile.label}. ${selected ? "Selected. Click a metric slot to place it." : "Click to select or drag to a metric slot."}`}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.(tile.id);
      }}
    >
      {tile.label}
    </button>
  );
}

interface MetricTilePoolProps {
  tiles: readonly MetricTile[];
  disabled?: boolean;
  selectedTileId?: string | null;
  onSelectTile?: (tileId: string) => void;
  workspacePart?: string;
}

export function MetricTilePool({
  tiles,
  disabled = false,
  selectedTileId,
  onSelectTile,
  workspacePart,
}: MetricTilePoolProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "tile-pool",
    data: { pool: true },
    disabled,
  });

  return (
    <section
      className={styles.poolSection}
      aria-labelledby="answer-pool-title"
      data-build-workspace-part={workspacePart}
    >
      <div className={styles.poolHeading}>
        <div>
          <p className={styles.sectionEyebrow}>Answer pool</p>
          <h2 id="answer-pool-title">Choose a value</h2>
        </div>
        <p>Click or drag.</p>
      </div>
      <div
        ref={setNodeRef}
        className={styles.tilePool}
        data-over={isOver}
        aria-label="Available answer tiles"
      >
        {tiles.length > 0 ? (
          tiles.map((tile) => (
            <DraggableMetricTile
              key={tile.id}
              tile={tile}
              disabled={disabled}
              selected={selectedTileId === tile.id}
              onSelect={onSelectTile}
            />
          ))
        ) : (
          <p className={styles.emptyPool}>All answer tiles are currently placed.</p>
        )}
      </div>
    </section>
  );
}
