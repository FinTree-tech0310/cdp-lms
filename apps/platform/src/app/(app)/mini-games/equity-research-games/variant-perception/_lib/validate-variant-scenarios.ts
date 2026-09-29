import { isVariantOptionId } from "./variant-options";
import type { VariantPerceptionScenario } from "./variant-perception-types";
export function validateVariantScenarios(scenarios: readonly VariantPerceptionScenario[]): void {
  const fail = (message: string): never => { throw new Error(`Variant Perception content error: ${message}`); };
  const text = (value: unknown, field: string) => {
    if (typeof value !== "string" || !value.trim()) fail(`${field} must be non-empty.`);
  };
  if (!Array.isArray(scenarios) || !scenarios.length) fail("At least one scenario is required.");
  const ids = new Set<string>();
  for (const scenario of scenarios) {
    text(scenario.id, "Scenario ID");
    if (ids.has(scenario.id)) fail(`Duplicate scenario ID: ${scenario.id}.`);
    ids.add(scenario.id);
    text(scenario.setupContext, `${scenario.id} setupContext`);
    if (!Array.isArray(scenario.options) || scenario.options.length !== 3) fail(`${scenario.id} requires exactly three options.`);
    const options = new Set<string>();
    for (const option of scenario.options) {
      if (!option || !isVariantOptionId(option.optionId)) fail(`${scenario.id} has an invalid option ID.`);
      if (options.has(option.optionId)) fail(`${scenario.id} has duplicate option ${option.optionId}.`);
      options.add(option.optionId);
      text(option.outcome, `${scenario.id} ${option.optionId} outcome`);
    }
  }
}
