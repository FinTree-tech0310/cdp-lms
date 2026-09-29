import { CHART_VIEWBOX, createChartGeometry } from "../_lib/chart-geometry";
import type { ChartScenario } from "../_lib/read-the-chart-types";
import styles from "../read-the-chart.module.css";

interface PriceReactionChartProps {
  scenario: ChartScenario;
}

export function PriceReactionChart({ scenario }: PriceReactionChartProps) {
  const geometry = createChartGeometry(scenario.pricePoints);
  const earningsBandWidth = 12;

  return (
    <figure className={styles.chartFigure}>
      <div className={styles.chartHeading}>
        <div>
          <p className={styles.eyebrow}>Price reaction</p>
          <h2>How the shares traded around the release</h2>
        </div>
        <p>Shape only · Prices intentionally hidden</p>
      </div>

      <div className={styles.chartSurface}>
        <svg
          className={styles.priceChart}
          viewBox={`0 0 ${CHART_VIEWBOX.width} ${CHART_VIEWBOX.height}`}
          aria-hidden="true"
          focusable="false"
        >
          <rect
            x={CHART_VIEWBOX.left}
            y={CHART_VIEWBOX.top}
            width={geometry.earningsMarkerX - CHART_VIEWBOX.left}
            height={CHART_VIEWBOX.bottom - CHART_VIEWBOX.top}
            className={styles.beforeRegion}
          />
          <rect
            x={geometry.earningsMarkerX}
            y={CHART_VIEWBOX.top}
            width={CHART_VIEWBOX.right - geometry.earningsMarkerX}
            height={CHART_VIEWBOX.bottom - CHART_VIEWBOX.top}
            className={styles.afterRegion}
          />

          {[0.25, 0.5, 0.75].map((ratio) => {
            const y = CHART_VIEWBOX.top
              + (CHART_VIEWBOX.bottom - CHART_VIEWBOX.top) * ratio;
            return (
              <line
                key={ratio}
                x1={CHART_VIEWBOX.left}
                x2={CHART_VIEWBOX.right}
                y1={y}
                y2={y}
                className={styles.gridLine}
              />
            );
          })}

          <rect
            x={geometry.earningsMarkerX - earningsBandWidth / 2}
            y={CHART_VIEWBOX.top}
            width={earningsBandWidth}
            height={CHART_VIEWBOX.bottom - CHART_VIEWBOX.top}
            className={styles.earningsBand}
          />
          <line
            x1={geometry.earningsMarkerX}
            x2={geometry.earningsMarkerX}
            y1={CHART_VIEWBOX.top - 8}
            y2={CHART_VIEWBOX.bottom + 8}
            className={styles.earningsMarker}
          />
          <text
            x={geometry.earningsMarkerX}
            y="25"
            textAnchor="middle"
            className={styles.earningsLabel}
          >
            EARNINGS
          </text>

          <path d={geometry.pathData} className={styles.priceLineHalo} />
          <path d={geometry.pathData} className={styles.priceLine} />
          {geometry.coordinates.map((point) => (
            <circle
              key={point.relativeDay}
              cx={point.x}
              cy={point.y}
              r="4.5"
              className={styles.pricePoint}
            />
          ))}

          <line
            x1={CHART_VIEWBOX.left}
            x2={CHART_VIEWBOX.right}
            y1={CHART_VIEWBOX.bottom}
            y2={CHART_VIEWBOX.bottom}
            className={styles.chartBaseline}
          />
          <text
            x={(CHART_VIEWBOX.left + geometry.earningsMarkerX) / 2}
            y="332"
            textAnchor="middle"
            className={styles.periodLabel}
          >
            BEFORE EARNINGS
          </text>
          <text
            x={(geometry.earningsMarkerX + CHART_VIEWBOX.right) / 2}
            y="332"
            textAnchor="middle"
            className={styles.periodLabel}
          >
            AFTER EARNINGS
          </text>
        </svg>
      </div>

      <figcaption className={styles.srOnly}>
        {scenario.movementDescriptionForScreenReaders}
      </figcaption>
    </figure>
  );
}
