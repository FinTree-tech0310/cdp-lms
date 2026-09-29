import type {
  AssetClass,
  RebalanceScenario,
} from "../_data/rebalance-scenarios";
import {
  formatAllocation,
  percentToUnits,
  type AllocationRecord,
} from "../_lib/allocation-math";
import styles from "../rebalance-the-drift.module.css";

interface AllocationControlsProps {
  scenario: RebalanceScenario;
  allocations: AllocationRecord;
  activeAssetClass: AssetClass | null;
  onChange: (assetClass: AssetClass, requestedUnits: number) => void;
  onActiveAssetChange: (assetClass: AssetClass | null) => void;
  interactionDisabled?: boolean;
}

export function AllocationControls({
  scenario,
  allocations,
  activeAssetClass,
  onChange,
  onActiveAssetChange,
  interactionDisabled = false,
}: AllocationControlsProps) {
  return (
    <section
      className={styles.controlPanel}
      aria-labelledby="allocation-controls-title"
      data-rebalance-guide="target"
    >
      <div className={styles.controlHeading}>
        <div>
          <p className={styles.sectionEyebrow}>Allocation controls</p>
          <h2 id="allocation-controls-title">Current vs. target</h2>
        </div>
        <span>Exact total: 100.0%</span>
      </div>
      <div className={styles.allocationRows} data-rebalance-guide="controls">
        {scenario.allocations.map((allocation) => {
          const currentUnits = allocations[allocation.assetClass];
          return (
            <div
              key={allocation.assetClass}
              className={styles.allocationRow}
              data-asset-class={allocation.assetClass}
              data-rebalance-guide-asset={allocation.assetClass}
              data-active={activeAssetClass === allocation.assetClass}
            >
              <div className={styles.allocationRowHeader}>
                <div className={styles.assetIdentity}>
                  <span className={styles.assetSwatch} aria-hidden="true" />
                  <strong>{allocation.label}</strong>
                </div>
                <div className={styles.allocationNumbers}>
                  <span><small>Your allocation</small>{formatAllocation(currentUnits)}</span>
                  <span><small>Target</small>{allocation.targetPercent.toFixed(1)}%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={currentUnits / 10}
                disabled={interactionDisabled}
                aria-label={`${allocation.label} allocation`}
                aria-valuetext={`${formatAllocation(currentUnits)}; target ${allocation.targetPercent.toFixed(1)}%`}
                onFocus={() => onActiveAssetChange(allocation.assetClass)}
                onBlur={() => onActiveAssetChange(null)}
                onPointerDown={() => onActiveAssetChange(allocation.assetClass)}
                onPointerUp={() => onActiveAssetChange(null)}
                onChange={(event) =>
                  onChange(
                    allocation.assetClass,
                    percentToUnits(Number(event.target.value)),
                  )
                }
              />
            </div>
          );
        })}
      </div>
      <p className={styles.redistributionNote}>
        Adjust one allocation and the other three redistribute proportionally to keep the portfolio at 100%.
      </p>
    </section>
  );
}
