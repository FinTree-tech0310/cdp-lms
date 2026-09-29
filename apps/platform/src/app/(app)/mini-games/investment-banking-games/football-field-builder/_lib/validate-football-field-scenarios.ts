import type { FootballFieldScenario, MethodologyId } from "./football-field-types";

const METHODOLOGY_IDS: readonly MethodologyId[] = ["dcf", "comps", "precedentTransactions"];

function requireText(value: string, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Football Field content error: ${field} must be non-empty.`);
  }
}

function requireFinite(value: number, field: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`Football Field content error: ${field} must be finite.`);
  }
}

export function validateFootballFieldScenarios(scenarios: readonly FootballFieldScenario[]) {
  if (scenarios.length === 0) throw new Error("Football Field content error: at least one scenario is required.");
  const scenarioIds = new Set<string>();
  for (const scenario of scenarios) {
    requireText(scenario.id, "scenario id");
    if (scenarioIds.has(scenario.id)) throw new Error(`Football Field content error: duplicate scenario id \"${scenario.id}\".`);
    scenarioIds.add(scenario.id);
    requireText(scenario.targetCompanyName, `scenario \"${scenario.id}\" targetCompanyName`);
    requireText(scenario.dealContextNote, `scenario \"${scenario.id}\" dealContextNote`);
    requireText(scenario.axisUnit, `scenario \"${scenario.id}\" axisUnit`);
    requireText(scenario.resultSummary, `scenario \"${scenario.id}\" resultSummary`);
    ["axisMin", "axisMax", "axisStep", "actualDealPrice"].forEach((field) =>
      requireFinite(scenario[field as "axisMin"], `scenario \"${scenario.id}\" ${field}`),
    );
    if (scenario.axisMin >= scenario.axisMax || scenario.axisStep <= 0) throw new Error(`Football Field content error: scenario \"${scenario.id}\" axis must ascend with a positive step.`);
    if (scenario.actualDealPrice < scenario.axisMin || scenario.actualDealPrice > scenario.axisMax) throw new Error(`Football Field content error: scenario \"${scenario.id}\" actualDealPrice must sit on the axis.`);
    if (scenario.methodologies.length !== 3) throw new Error(`Football Field content error: scenario \"${scenario.id}\" must have exactly three methodologies.`);
    const methodologyIds = new Set(scenario.methodologies.map((methodology) => methodology.id));
    if (methodologyIds.size !== 3 || METHODOLOGY_IDS.some((id) => !methodologyIds.has(id))) throw new Error(`Football Field content error: scenario \"${scenario.id}\" must include DCF, comps, and precedents exactly once.`);
    for (const methodology of scenario.methodologies) {
      requireText(methodology.label, `scenario \"${scenario.id}\" ${methodology.id} label`);
      requireText(methodology.analystEvidence, `scenario \"${scenario.id}\" ${methodology.id} analystEvidence`);
      ["referenceLow", "referenceHigh", "toleranceAmount"].forEach((field) =>
        requireFinite(methodology[field as "referenceLow"], `scenario \"${scenario.id}\" ${methodology.id} ${field}`),
      );
      if (methodology.referenceLow > methodology.referenceHigh || methodology.referenceLow < scenario.axisMin || methodology.referenceHigh > scenario.axisMax || methodology.toleranceAmount < 0) throw new Error(`Football Field content error: scenario \"${scenario.id}\" ${methodology.id} reference range is invalid.`);
    }
  }
}
