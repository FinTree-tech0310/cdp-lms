import type {
  CompsCandidate,
  CompsScenario,
} from "../_data/comps-scenarios";

function requireText(value: string, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`The Comps Screen content error: ${field} must be non-empty.`);
  }
}

function validateCandidate(candidate: CompsCandidate, scenarioId: string) {
  const fieldPrefix = `scenario "${scenarioId}", candidate "${candidate.id || "unknown"}"`;
  requireText(candidate.id, `${fieldPrefix} id`);
  requireText(candidate.name, `${fieldPrefix} name`);
  requireText(candidate.industry, `${fieldPrefix} industry`);
  requireText(candidate.revenueSize, `${fieldPrefix} revenueSize`);
  requireText(candidate.geography, `${fieldPrefix} geography`);
  requireText(candidate.businessModelLine, `${fieldPrefix} businessModelLine`);
  requireText(candidate.reasoning, `${fieldPrefix} reasoning`);

  if (typeof candidate.shouldInclude !== "boolean") {
    throw new Error(
      `The Comps Screen content error: ${fieldPrefix} shouldInclude must be boolean.`,
    );
  }
}

export function validateCompsScenarios(scenarios: readonly CompsScenario[]) {
  const scenarioIds = new Set<string>();

  for (const scenario of scenarios) {
    requireText(scenario.id, "scenario id");
    if (scenarioIds.has(scenario.id)) {
      throw new Error(
        `The Comps Screen content error: duplicate scenario id "${scenario.id}".`,
      );
    }
    scenarioIds.add(scenario.id);

    requireText(scenario.screeningBrief, `scenario "${scenario.id}" screeningBrief`);
    requireText(scenario.targetCompany.name, `scenario "${scenario.id}" target name`);
    requireText(
      scenario.targetCompany.industry,
      `scenario "${scenario.id}" target industry`,
    );
    requireText(
      scenario.targetCompany.revenueSize,
      `scenario "${scenario.id}" target revenueSize`,
    );
    requireText(
      scenario.targetCompany.geography,
      `scenario "${scenario.id}" target geography`,
    );
    requireText(
      scenario.targetCompany.businessModelLine,
      `scenario "${scenario.id}" target businessModelLine`,
    );

    if (!Array.isArray(scenario.candidates) || scenario.candidates.length === 0) {
      throw new Error(
        `The Comps Screen content error: scenario "${scenario.id}" needs at least one candidate.`,
      );
    }

    if (!scenario.id.startsWith("test-") && scenario.candidates.length !== 8) {
      throw new Error(
        `The Comps Screen content error: production scenario "${scenario.id}" must contain exactly 8 candidates.`,
      );
    }

    const candidateIds = new Set<string>();
    for (const candidate of scenario.candidates) {
      validateCandidate(candidate, scenario.id);
      if (candidateIds.has(candidate.id)) {
        throw new Error(
          `The Comps Screen content error: duplicate candidate id "${candidate.id}" in scenario "${scenario.id}".`,
        );
      }
      candidateIds.add(candidate.id);
    }
  }
}
