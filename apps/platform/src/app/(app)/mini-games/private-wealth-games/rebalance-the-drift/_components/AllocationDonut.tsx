"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";

import type {
  AssetClass,
  RebalanceScenario,
} from "../_data/rebalance-scenarios";
import {
  ASSET_CLASS_ORDER,
  formatAllocation,
  TOTAL_ALLOCATION_UNITS,
  type AllocationRecord,
  type AllocationStatus,
} from "../_lib/allocation-math";
import styles from "../rebalance-the-drift.module.css";

interface DragState {
  pointerId: number;
  assetClass: AssetClass;
  lastAngle: number;
  accumulatedDegrees: number;
  startingUnits: number;
}

interface AllocationDonutProps {
  scenario: RebalanceScenario;
  allocations: AllocationRecord;
  activeAssetClass: AssetClass | null;
  statuses?: AllocationStatus;
  readOnly?: boolean;
  interactionDisabled?: boolean;
  onChange?: (assetClass: AssetClass, requestedUnits: number) => void;
  onActiveAssetChange?: (assetClass: AssetClass | null) => void;
}

const CENTER = 120;
const RADIUS = 82;
const SEGMENT_GAP_UNITS = 7;

function pointerAngle(
  event: PointerEvent<SVGCircleElement>,
): number {
  const svg = event.currentTarget.ownerSVGElement;
  if (!svg) return 0;
  const bounds = svg.getBoundingClientRect();
  const x = event.clientX - (bounds.left + bounds.width / 2);
  const y = event.clientY - (bounds.top + bounds.height / 2);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

function signedAngleDelta(nextAngle: number, previousAngle: number): number {
  let delta = nextAngle - previousAngle;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

export function AllocationDonut({
  scenario,
  allocations,
  activeAssetClass,
  statuses,
  readOnly = false,
  interactionDisabled = false,
  onChange,
  onActiveAssetChange,
}: AllocationDonutProps) {
  const dragStateRef = useRef<DragState | null>(null);
  const labels = new Map(
    scenario.allocations.map((allocation) => [
      allocation.assetClass,
      allocation.label,
    ]),
  );

  function handlePointerDown(
    event: PointerEvent<SVGCircleElement>,
    assetClass: AssetClass,
  ) {
    if (readOnly || interactionDisabled || !onChange) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      assetClass,
      lastAngle: pointerAngle(event),
      accumulatedDegrees: 0,
      startingUnits: allocations[assetClass],
    };
    onActiveAssetChange?.(assetClass);
  }

  function handlePointerMove(event: PointerEvent<SVGCircleElement>) {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !onChange) return;
    const nextAngle = pointerAngle(event);
    drag.accumulatedDegrees += signedAngleDelta(nextAngle, drag.lastAngle);
    drag.lastAngle = nextAngle;
    const requestedUnits =
      drag.startingUnits
      + (drag.accumulatedDegrees / 360) * TOTAL_ALLOCATION_UNITS;
    onChange(drag.assetClass, requestedUnits);
  }

  function finishPointerDrag(event: PointerEvent<SVGCircleElement>) {
    if (dragStateRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;
    onActiveAssetChange?.(null);
  }

  function handleKeyDown(
    event: KeyboardEvent<SVGCircleElement>,
    assetClass: AssetClass,
  ) {
    if (readOnly || interactionDisabled || !onChange) return;
    let requestedUnits: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      requestedUnits = allocations[assetClass] + 10;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      requestedUnits = allocations[assetClass] - 10;
    } else if (event.key === "Home") {
      requestedUnits = 0;
    } else if (event.key === "End") {
      requestedUnits = TOTAL_ALLOCATION_UNITS;
    }
    if (requestedUnits === null) return;
    event.preventDefault();
    onActiveAssetChange?.(assetClass);
    onChange(assetClass, requestedUnits);
  }

  return (
    <div className={styles.donutFrame}>
      <svg
        className={styles.donut}
        viewBox="0 0 240 240"
        role="group"
        aria-label={readOnly
          ? "Submitted portfolio allocation"
          : interactionDisabled
            ? "Portfolio allocation; adjustments paused while the guide is open"
            : "Adjustable portfolio allocation"}
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          className={styles.donutTrack}
        />
        {ASSET_CLASS_ORDER.map((assetClass, assetIndex) => {
          const units = allocations[assetClass];
          const visibleUnits = Math.max(0, units - SEGMENT_GAP_UNITS);
          const segmentStart = ASSET_CLASS_ORDER.slice(0, assetIndex).reduce(
            (total, previousAssetClass) =>
              total + allocations[previousAssetClass],
            0,
          );
          const label = labels.get(assetClass) ?? assetClass;
          const status = statuses
            ? statuses[assetClass]
              ? "within"
              : "outside"
            : "pending";

          return (
            <circle
              key={assetClass}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              pathLength={TOTAL_ALLOCATION_UNITS}
              className={styles.donutSegment}
              data-asset-class={assetClass}
              data-active={activeAssetClass === assetClass}
              data-status={status}
              strokeDasharray={`${visibleUnits} ${TOTAL_ALLOCATION_UNITS - visibleUnits}`}
              strokeDashoffset={-segmentStart}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
              role={readOnly || interactionDisabled ? undefined : "slider"}
              tabIndex={readOnly || interactionDisabled ? undefined : 0}
              aria-label={readOnly || interactionDisabled ? undefined : `${label} allocation`}
              aria-valuemin={readOnly || interactionDisabled ? undefined : 0}
              aria-valuemax={readOnly || interactionDisabled ? undefined : 100}
              aria-valuenow={readOnly || interactionDisabled ? undefined : units / 10}
              aria-valuetext={readOnly || interactionDisabled ? undefined : formatAllocation(units)}
              onPointerDown={(event) => handlePointerDown(event, assetClass)}
              onPointerMove={handlePointerMove}
              onPointerUp={finishPointerDrag}
              onPointerCancel={finishPointerDrag}
              onKeyDown={(event) => handleKeyDown(event, assetClass)}
              onFocus={() => onActiveAssetChange?.(assetClass)}
              onBlur={() => onActiveAssetChange?.(null)}
            />
          );
        })}
        <circle cx={CENTER} cy={CENTER} r="52" className={styles.donutCenter} />
        <text x={CENTER} y="113" textAnchor="middle" className={styles.donutTotal}>
          100.0%
        </text>
        <text x={CENTER} y="133" textAnchor="middle" className={styles.donutCaption}>
          {readOnly ? "Submitted" : "Live allocation"}
        </text>
      </svg>
      {!readOnly ? (
        <p className={styles.dragHint}>
          Drag a segment around the ring, or use the precise controls.
        </p>
      ) : null}
    </div>
  );
}
