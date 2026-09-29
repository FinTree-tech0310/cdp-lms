import { assumptionStatus, assumptionValues, isStepAligned, normalizeAssumptionValue } from "./assumption-values";
import { computeModelOutputs } from "./compute-model-outputs";
import { ASSUMPTION_IDS, type ModelUpdateScenario } from "./model-update-types";

function fail(message: string): never {
  throw new Error(`Model Update Reflex content error: ${message}`);
}
function text(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) fail(`${field} must be non-empty.`);
}
function finite(value: unknown, field: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) fail(`${field} must be finite.`);
}

export function validateModelUpdateScenarios(scenarios: readonly ModelUpdateScenario[]): void {
  if (!scenarios.length) fail("at least one scenario is required.");
  const ids = new Set<string>();
  for (const scenario of scenarios) {
    text(scenario.id, "scenario id");
    const prefix = `scenario "${scenario.id}"`;
    if (ids.has(scenario.id)) fail(`${prefix}: duplicate scenario id.`);
    ids.add(scenario.id);
    for (const key of ["triggerEvent", "financialUnit", "resultSummary"] as const) text(scenario[key], `${prefix} ${key}`);
    finite(scenario.priorPeriodActuals?.revenue, `${prefix} prior revenue`);
    finite(scenario.priorPeriodActuals?.opex, `${prefix} prior opex`);
    if (scenario.priorPeriodActuals.revenue <= 0) fail(`${prefix} revenue must be > 0.`);
    if (scenario.priorPeriodActuals.opex < 0) fail(`${prefix} opex must be >= 0.`);
    if (!Array.isArray(scenario.assumptions) || scenario.assumptions.length !== 3) fail(`${prefix} needs exactly three assumptions.`);
    const driverIds = new Set<string>();
    for (const driver of scenario.assumptions) {
      const field = `${prefix}, assumption "${driver.id}"`;
      if (!ASSUMPTION_IDS.includes(driver.id)) fail(`${field}: invalid ID.`);
      if (driverIds.has(driver.id)) fail(`${field}: duplicate assumption ID.`);
      driverIds.add(driver.id);
      for (const key of ["label", "unit", "revisionEvidence", "reasoning"] as const) text(driver[key], `${field} ${key}`);
      for (const key of ["min", "max", "step", "startingValue", "referenceValue", "toleranceAmount"] as const) finite(driver[key], `${field} ${key}`);
      if (driver.min >= driver.max) fail(`${field} min must be below max.`);
      if (driver.step <= 0) fail(`${field} step must be > 0.`);
      if (driver.toleranceAmount < 0) fail(`${field} toleranceAmount must be >= 0.`);
      for (const key of ["startingValue", "referenceValue"] as const) {
        if (driver[key] < driver.min || driver[key] > driver.max) fail(`${field} ${key} must be within [min, max].`);
      }
      if (driver.id === "grossMarginPercent" && (driver.min < 0 || driver.max > 100)) fail(`${field} gross margin bounds must be within [0, 100].`);
      if (!isStepAligned(driver, driver.startingValue)) fail(`${field} startingValue is not aligned to min + n × step.`);
      const selectable = normalizeAssumptionValue(driver, driver.referenceValue);
      if (!Number.isFinite(selectable) || assumptionStatus(selectable, driver.referenceValue, driver.toleranceAmount) !== "onTarget") {
        fail(`${field} On Target is unreachable: nearest selectable value ${selectable}, reference ${driver.referenceValue}, tolerance ${driver.toleranceAmount}.`);
      }
    }
    for (const id of ASSUMPTION_IDS) if (!driverIds.has(id)) fail(`${prefix} missing assumption ${id}.`);
    for (const field of ["startingValue", "referenceValue"] as const) {
      const outputs = computeModelOutputs(scenario.priorPeriodActuals, assumptionValues(scenario.assumptions, field));
      for (const [key, value] of Object.entries(outputs)) finite(value, `${prefix} ${field} output ${key}`);
    }
  }
}
