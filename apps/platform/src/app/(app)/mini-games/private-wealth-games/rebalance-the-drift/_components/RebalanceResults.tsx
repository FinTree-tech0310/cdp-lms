import { VcPrimaryButton } from "@/app/(app)/mini-games/vc-games/_components/VcPrimaryButton";

import type { RebalanceScenario } from "../_data/rebalance-scenarios";
import {
  evaluateAllocations,
  formatAllocation,
  percentToUnits,
  type AllocationRecord,
} from "../_lib/allocation-math";
import { AllocationDonut } from "./AllocationDonut";
import styles from "../rebalance-the-drift.module.css";

interface RebalanceResultsProps {
  scenario: RebalanceScenario;
  allocations: AllocationRecord;
  onTryAnother: () => void;
}

export function RebalanceResults({
  scenario,
  allocations,
  onTryAnother,
}: RebalanceResultsProps) {
  const statuses = evaluateAllocations(allocations, scenario);

  return (
    <section className={styles.resultsPanel} aria-labelledby="rebalance-results-title">
      <div className={styles.resultsHeading}>
        <p className={styles.sectionEyebrow}>Allocation submitted</p>
        <h1 id="rebalance-results-title">How close did you land?</h1>
        <p>
          This scenario allows a tolerance of ±{scenario.tolerancePercent.toFixed(1)} percentage points.
        </p>
      </div>

      <div className={styles.resultsGrid}>
        <section className={styles.resultChartPanel} aria-label="Submitted allocation chart">
          <AllocationDonut
            scenario={scenario}
            allocations={allocations}
            activeAssetClass={null}
            statuses={statuses}
            readOnly
          />
          <div className={styles.resultLegend}>
            <span><i data-status="within" />Within range</span>
            <span><i data-status="outside" />Outside range</span>
          </div>
        </section>

        <div className={styles.resultRows}>
          {scenario.allocations.map((allocation) => {
            const finalUnits = allocations[allocation.assetClass];
            const targetUnits = percentToUnits(allocation.targetPercent);
            const difference = Math.abs(finalUnits - targetUnits) / 10;
            const isWithin = statuses[allocation.assetClass];
            return (
              <article
                key={allocation.assetClass}
                className={styles.resultRow}
                data-status={isWithin ? "within" : "outside"}
              >
                <div>
                  <span>{isWithin ? "Within range" : "Outside range"}</span>
                  <h2>{allocation.label}</h2>
                </div>
                <dl>
                  <div><dt>Your allocation</dt><dd>{formatAllocation(finalUnits)}</dd></div>
                  <div><dt>Target</dt><dd>{allocation.targetPercent.toFixed(1)}%</dd></div>
                  <div><dt>Distance</dt><dd>{difference.toFixed(1)} pts</dd></div>
                </dl>
              </article>
            );
          })}
        </div>
      </div>

      <article className={styles.summaryPanel}>
        <p className={styles.sectionEyebrow}>Portfolio perspective</p>
        <p>{scenario.resultSummary}</p>
      </article>

      <div className={styles.resultsAction}>
        <VcPrimaryButton beam spacing="roomy" onClick={onTryAnother}>
          Try Another
        </VcPrimaryButton>
      </div>
    </section>
  );
}
