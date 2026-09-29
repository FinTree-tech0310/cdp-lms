import type {
  AssetClass,
  RebalanceScenario,
} from "../_data/rebalance-scenarios";

export const TOTAL_ALLOCATION_UNITS = 1_000;
export const ALLOCATION_UNITS_PER_PERCENT = 10;

export const ASSET_CLASS_ORDER: readonly AssetClass[] = [
  "equities",
  "fixedIncome",
  "cash",
  "alternatives",
];

export type AllocationRecord = Record<AssetClass, number>;
export type AllocationStatus = Record<AssetClass, boolean>;

export function percentToUnits(percent: number): number {
  return Math.round(percent * ALLOCATION_UNITS_PER_PERCENT);
}

export function unitsToPercent(units: number): number {
  return units / ALLOCATION_UNITS_PER_PERCENT;
}

export function formatAllocation(units: number): string {
  return `${unitsToPercent(units).toFixed(1)}%`;
}

export function scenarioCurrentAllocations(
  scenario: RebalanceScenario,
): AllocationRecord {
  const values = Object.fromEntries(
    scenario.allocations.map((allocation) => [
      allocation.assetClass,
      percentToUnits(allocation.currentPercent),
    ]),
  );
  return values as AllocationRecord;
}

export function scenarioTargetAllocations(
  scenario: RebalanceScenario,
): AllocationRecord {
  const values = Object.fromEntries(
    scenario.allocations.map((allocation) => [
      allocation.assetClass,
      percentToUnits(allocation.targetPercent),
    ]),
  );
  return values as AllocationRecord;
}

function distributeEvenly(
  remainingUnits: number,
  assetClasses: readonly AssetClass[],
): Record<AssetClass, number> {
  const base = Math.floor(remainingUnits / assetClasses.length);
  let remainder = remainingUnits - base * assetClasses.length;
  const result = {} as Record<AssetClass, number>;

  for (const assetClass of assetClasses) {
    result[assetClass] = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
  }
  return result;
}

export function redistributeAllocation(
  current: AllocationRecord,
  changedAssetClass: AssetClass,
  requestedUnits: number,
): AllocationRecord {
  const nextChangedUnits = Math.max(
    0,
    Math.min(TOTAL_ALLOCATION_UNITS, Math.round(requestedUnits)),
  );
  const otherAssetClasses = ASSET_CLASS_ORDER.filter(
    (assetClass) => assetClass !== changedAssetClass,
  );
  const remainingUnits = TOTAL_ALLOCATION_UNITS - nextChangedUnits;
  const currentOtherTotal = otherAssetClasses.reduce(
    (total, assetClass) => total + current[assetClass],
    0,
  );

  const next = {
    ...current,
    [changedAssetClass]: nextChangedUnits,
  };

  if (currentOtherTotal === 0) {
    return {
      ...next,
      ...distributeEvenly(remainingUnits, otherAssetClasses),
    };
  }

  const shares = otherAssetClasses.map((assetClass, order) => {
    const exact = (current[assetClass] * remainingUnits) / currentOtherTotal;
    const floor = Math.floor(exact);
    return { assetClass, floor, fraction: exact - floor, order };
  });
  let unassigned =
    remainingUnits - shares.reduce((total, share) => total + share.floor, 0);
  const remainderOrder = [...shares].sort(
    (left, right) => right.fraction - left.fraction || left.order - right.order,
  );
  const additions = new Map<AssetClass, number>();

  for (const share of remainderOrder) {
    if (unassigned <= 0) break;
    additions.set(share.assetClass, 1);
    unassigned -= 1;
  }

  for (const share of shares) {
    next[share.assetClass] = share.floor + (additions.get(share.assetClass) ?? 0);
  }

  return next;
}

export function evaluateAllocations(
  finalAllocations: AllocationRecord,
  scenario: RebalanceScenario,
): AllocationStatus {
  const targets = scenarioTargetAllocations(scenario);
  const toleranceUnits = percentToUnits(scenario.tolerancePercent);
  return Object.fromEntries(
    ASSET_CLASS_ORDER.map((assetClass) => [
      assetClass,
      Math.abs(finalAllocations[assetClass] - targets[assetClass])
        <= toleranceUnits,
    ]),
  ) as AllocationStatus;
}
