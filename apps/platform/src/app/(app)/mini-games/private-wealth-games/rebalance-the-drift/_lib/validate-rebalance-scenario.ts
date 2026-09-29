import {
  ASSET_CLASS_ORDER,
  percentToUnits,
  TOTAL_ALLOCATION_UNITS,
} from "./allocation-math";
import type { RebalanceScenario } from "../_data/rebalance-scenarios";

export function validateRebalanceScenario(scenario: RebalanceScenario): void {
  if (scenario.allocations.length !== ASSET_CLASS_ORDER.length) {
    throw new Error(`Rebalance scenario ${scenario.id} must contain four allocations.`);
  }

  const assetClasses = new Set(
    scenario.allocations.map((allocation) => allocation.assetClass),
  );
  if (
    assetClasses.size !== ASSET_CLASS_ORDER.length
    || !ASSET_CLASS_ORDER.every((assetClass) => assetClasses.has(assetClass))
  ) {
    throw new Error(
      `Rebalance scenario ${scenario.id} must contain each required asset class once.`,
    );
  }

  for (const allocation of scenario.allocations) {
    for (const value of [allocation.currentPercent, allocation.targetPercent]) {
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        throw new Error(
          `Rebalance scenario ${scenario.id} contains an invalid allocation.`,
        );
      }
    }
  }

  const currentTotal = scenario.allocations.reduce(
    (total, allocation) => total + percentToUnits(allocation.currentPercent),
    0,
  );
  const targetTotal = scenario.allocations.reduce(
    (total, allocation) => total + percentToUnits(allocation.targetPercent),
    0,
  );
  if (
    currentTotal !== TOTAL_ALLOCATION_UNITS
    || targetTotal !== TOTAL_ALLOCATION_UNITS
  ) {
    throw new Error(
      `Rebalance scenario ${scenario.id} current and target allocations must total 100%.`,
    );
  }

  if (!Number.isFinite(scenario.tolerancePercent) || scenario.tolerancePercent < 0) {
    throw new Error(`Rebalance scenario ${scenario.id} has an invalid tolerance.`);
  }
  if (
    scenario.clientName.trim().length === 0
    || scenario.contextNote.trim().length === 0
    || scenario.resultSummary.trim().length === 0
  ) {
    throw new Error(`Rebalance scenario ${scenario.id} is missing authored content.`);
  }
}
