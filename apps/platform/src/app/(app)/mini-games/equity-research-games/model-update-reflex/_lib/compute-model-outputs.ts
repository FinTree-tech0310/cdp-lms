import type { AssumptionValues, ModelOutputs, PriorPeriodActuals } from "./model-update-types";

export function computeModelOutputs(
  actuals: PriorPeriodActuals,
  values: Readonly<AssumptionValues>,
): ModelOutputs {
  const projectedRevenue = actuals.revenue * (1 + values.revenueGrowthRate / 100);
  const projectedGrossProfit = projectedRevenue * (values.grossMarginPercent / 100);
  const projectedOpex = actuals.opex * (1 + values.opexGrowthRate / 100);
  const projectedEBITDA = projectedGrossProfit - projectedOpex;
  return { projectedRevenue, projectedGrossProfit, projectedOpex, projectedEBITDA };
}
