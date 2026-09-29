"use client";

import { useRef, type PointerEvent } from "react";

import { valueForX, xForValue } from "../_lib/football-field-geometry";
import type {
  FootballFieldScenario,
  LearnerRanges,
  MethodologyId,
  SubmittedFootballFieldSnapshot,
} from "../_lib/football-field-types";
import styles from "../football-field-builder.module.css";

const CHART_LEFT = 70;
const CHART_WIDTH = 660;
const ROW_Y: Record<MethodologyId, number> = { dcf: 76, comps: 146, precedentTransactions: 216 };
const SVG_WIDTH = 800;
const SVG_HEIGHT = 286;

interface ActiveDrag {
  pointerId: number;
  methodologyId: MethodologyId;
  endpoint: "low" | "high";
}

interface FootballFieldChartProps {
  scenario: FootballFieldScenario;
  ranges: LearnerRanges;
  snapshot?: SubmittedFootballFieldSnapshot | null;
  interactive?: boolean;
  onChange?: (methodologyId: MethodologyId, endpoint: "low" | "high", value: number) => void;
}

function axisTicks(scenario: FootballFieldScenario) {
  const tickCount = 6;
  return Array.from({ length: tickCount }, (_, index) => {
    const ratio = index / (tickCount - 1);
    return scenario.axisMin + Math.round(((scenario.axisMax - scenario.axisMin) * ratio) / scenario.axisStep) * scenario.axisStep;
  });
}

export function FootballFieldChart({ scenario, ranges, snapshot, interactive = false, onChange }: FootballFieldChartProps) {
  const dragRef = useRef<ActiveDrag | null>(null);
  const ticks = axisTicks(scenario);

  function xFromPointer(event: PointerEvent<SVGCircleElement>) {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return scenario.axisMin;
    const bounds = svg.getBoundingClientRect();
    const viewBoxX = ((event.clientX - bounds.left) / bounds.width) * SVG_WIDTH;
    return valueForX(viewBoxX, scenario.axisMin, scenario.axisMax, scenario.axisStep, CHART_LEFT, CHART_WIDTH);
  }

  function updateFromPointer(event: PointerEvent<SVGCircleElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !onChange) return;
    onChange(drag.methodologyId, drag.endpoint, xFromPointer(event));
  }

  function finishDrag(event: PointerEvent<SVGCircleElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  }

  return (
    <div className={styles.chartFrame}>
      <svg className={styles.chart} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} role="img" aria-label={snapshot ? "Submitted football field with reference ranges" : "Adjustable football field with three valuation ranges"}>
        {ticks.map((tick) => {
          const x = xForValue(tick, scenario.axisMin, scenario.axisMax, CHART_LEFT, CHART_WIDTH);
          return <g key={tick}><line x1={x} x2={x} y1="30" y2="238" className={styles.gridLine} /><text x={x} y="266" textAnchor="middle" className={styles.tickLabel}>{tick}</text></g>;
        })}
        <line x1={CHART_LEFT} x2={CHART_LEFT + CHART_WIDTH} y1="238" y2="238" className={styles.axisLine} />
        {scenario.methodologies.map((methodology) => {
          const range = ranges[methodology.id];
          const y = ROW_Y[methodology.id];
          const lowX = xForValue(range.low, scenario.axisMin, scenario.axisMax, CHART_LEFT, CHART_WIDTH);
          const highX = xForValue(range.high, scenario.axisMin, scenario.axisMax, CHART_LEFT, CHART_WIDTH);
          const referenceLowX = xForValue(methodology.referenceLow, scenario.axisMin, scenario.axisMax, CHART_LEFT, CHART_WIDTH);
          const referenceHighX = xForValue(methodology.referenceHigh, scenario.axisMin, scenario.axisMax, CHART_LEFT, CHART_WIDTH);
          const status = snapshot?.statuses[methodology.id];
          return (
            <g key={methodology.id}>
              <text x="12" y={y + 5} className={styles.rowLabel}>{methodology.label}</text>
              <line x1={CHART_LEFT} x2={CHART_LEFT + CHART_WIDTH} y1={y} y2={y} className={styles.neutralTrack} />
              {snapshot ? <line x1={referenceLowX} x2={referenceHighX} y1={y} y2={y} className={styles.referenceRange} /> : null}
              <line x1={lowX} x2={highX} y1={y} y2={y} className={styles.learnerRange} data-status={status} />
              {interactive ? (
                <>
                  {(["low", "high"] as const).map((endpoint) => {
                    const x = endpoint === "low" ? lowX : highX;
                    return <circle key={endpoint} cx={x} cy={y} r="14" className={styles.handleHit} onPointerDown={(event) => {
                      if (!onChange) return;
                      event.preventDefault();
                      event.currentTarget.setPointerCapture(event.pointerId);
                      dragRef.current = { pointerId: event.pointerId, methodologyId: methodology.id, endpoint };
                      onChange(methodology.id, endpoint, xFromPointer(event));
                    }} onPointerMove={updateFromPointer} onPointerUp={finishDrag} onPointerCancel={finishDrag} />;
                  })}
                  <circle cx={lowX} cy={y} r="6" className={styles.handleVisible} /><circle cx={highX} cy={y} r="6" className={styles.handleVisible} />
                </>
              ) : null}
            </g>
          );
        })}
        {snapshot ? <>
          <line x1={xForValue(snapshot.combinedLow, scenario.axisMin, scenario.axisMax, CHART_LEFT, CHART_WIDTH)} x2={xForValue(snapshot.combinedHigh, scenario.axisMin, scenario.axisMax, CHART_LEFT, CHART_WIDTH)} y1="252" y2="252" className={styles.combinedRange} />
          <line x1={xForValue(scenario.actualDealPrice, scenario.axisMin, scenario.axisMax, CHART_LEFT, CHART_WIDTH)} x2={xForValue(scenario.actualDealPrice, scenario.axisMin, scenario.axisMax, CHART_LEFT, CHART_WIDTH)} y1="20" y2="252" className={styles.dealPriceMarker} />
        </> : null}
      </svg>
      <p className={styles.chartLegend}>{snapshot ? "Reference range · Your submitted range · Actual deal price" : "Drag either endpoint, or use the precise Low and High inputs below."}</p>
    </div>
  );
}
