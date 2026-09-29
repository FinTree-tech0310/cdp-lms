import { ASSUMPTION_IDS, type AssumptionDriver, type AssumptionValues } from "./model-update-types";

export function orderedAssumptions(drivers: readonly AssumptionDriver[]): AssumptionDriver[] {
  return ASSUMPTION_IDS.map((id) => {
    const driver = drivers.find((item) => item.id === id);
    if (!driver) throw new Error(`Model Update Reflex: missing assumption ${id}.`);
    return driver;
  });
}

export function assumptionValues(
  drivers: readonly AssumptionDriver[],
  field: "startingValue" | "referenceValue",
): AssumptionValues {
  const [revenue, margin, opex] = orderedAssumptions(drivers);
  return {
    revenueGrowthRate: revenue[field], grossMarginPercent: margin[field], opexGrowthRate: opex[field],
  };
}

export function decimalPlaces(value: number): number {
  const [coefficient, exponent = "0"] = String(value).toLowerCase().split("e");
  return Math.max(0, (coefficient.split(".")[1]?.length ?? 0) - Number(exponent));
}

type SliderGrid = Pick<AssumptionDriver, "min" | "max" | "step">;
const GRID_EPSILON = 1e-9;

export function sliderValueAt(driver: SliderGrid, index: number): number {
  const precision = Math.min(100, Math.max(decimalPlaces(driver.min), decimalPlaces(driver.step)));
  return Number((driver.min + index * driver.step).toFixed(precision));
}

export function normalizeAssumptionValue(driver: SliderGrid, requested: number): number {
  const lastIndex = Math.floor((driver.max - driver.min) / driver.step + GRID_EPSILON);
  let index = Math.max(0, Math.min(lastIndex, Math.round((requested - driver.min) / driver.step)));
  let value = sliderValueAt(driver, index);
  if (value > driver.max && index > 0) value = sliderValueAt(driver, --index);
  return Object.is(value, -0) ? 0 : value;
}

export function isStepAligned(driver: SliderGrid, value: number): boolean {
  const index = (value - driver.min) / driver.step;
  return Number.isFinite(index) && Math.abs(index - Math.round(index)) <= GRID_EPSILON;
}

export function assumptionStatus(submitted: number, reference: number, tolerance: number) {
  return Math.abs(submitted - reference) <= tolerance ? "onTarget" as const : "needsAdjustment" as const;
}
