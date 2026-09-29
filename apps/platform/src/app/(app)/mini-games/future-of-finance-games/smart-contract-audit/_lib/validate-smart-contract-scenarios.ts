import type { CodeLine, SmartContractScenario, VulnerabilityTypeOption } from "./smart-contract-types";

function fail(message: string): never {
  throw new Error(`Smart Contract Audit content error: ${message}`);
}

function requireText(value: unknown, field: string): void {
  if (typeof value !== "string" || !value.trim()) fail(`${field} must be non-empty.`);
}

export function validateSmartContractScenarios(scenarios: readonly SmartContractScenario[]): void {
  if (!Array.isArray(scenarios) || scenarios.length === 0) fail("At least one scenario is required.");
  const scenarioIds = new Set<string>();
  for (const scenario of scenarios) {
    if (!scenario || typeof scenario !== "object") fail("Invalid scenario.");
    requireText(scenario.id, "Scenario ID");
    if (scenarioIds.has(scenario.id)) fail(`Duplicate scenario ID: ${scenario.id}.`);
    scenarioIds.add(scenario.id);
    requireText(scenario.functionContext, `${scenario.id} functionContext`);

    if (!Array.isArray(scenario.lines) || scenario.lines.length < 2) {
      fail(`${scenario.id} needs at least two code lines.`);
    }
    const lineIds = new Set<string>();
    const lineNumbers = new Set<number>();
    let previousLineNumber = 0;
    let vulnerableLineCount = 0;
    let actualVulnerableLineId: string | null = null;
    for (const [index, line] of (scenario.lines as CodeLine[]).entries()) {
      const name = `${scenario.id} line ${index + 1}`;
      if (!line || typeof line !== "object") fail(`${name} is invalid.`);
      requireText(line.id, `${name} ID`);
      if (lineIds.has(line.id)) fail(`${scenario.id} has duplicate line ID: ${line.id}.`);
      lineIds.add(line.id);
      if (!Number.isInteger(line.lineNumber) || line.lineNumber <= 0) {
        fail(`${name} lineNumber must be a positive integer.`);
      }
      if (lineNumbers.has(line.lineNumber)) fail(`${scenario.id} has duplicate lineNumber: ${line.lineNumber}.`);
      lineNumbers.add(line.lineNumber);
      if (line.lineNumber <= previousLineNumber) fail(`${scenario.id} lines must have increasing lineNumbers.`);
      previousLineNumber = line.lineNumber;
      requireText(line.code, `${name} code`);
      requireText(line.lineExplanation, `${name} lineExplanation`);
      if (typeof line.isVulnerableLine !== "boolean") fail(`${name} isVulnerableLine must be boolean.`);
      if (line.isVulnerableLine) {
        vulnerableLineCount += 1;
        actualVulnerableLineId = line.id;
      }
    }
    if (vulnerableLineCount !== 1) fail(`${scenario.id} must have exactly one vulnerable line.`);
    requireText(scenario.vulnerableLineId, `${scenario.id} vulnerableLineId`);
    if (scenario.vulnerableLineId !== actualVulnerableLineId) {
      fail(`${scenario.id} vulnerableLineId must match the single flagged line.`);
    }

    if (!Array.isArray(scenario.vulnerabilityTypeOptions) || ![4, 5].includes(scenario.vulnerabilityTypeOptions.length)) {
      fail(`${scenario.id} needs exactly four or five vulnerability type options.`);
    }
    const optionIds = new Set<string>();
    const optionLabels = new Set<string>();
    for (const [index, option] of (scenario.vulnerabilityTypeOptions as VulnerabilityTypeOption[]).entries()) {
      const name = `${scenario.id} type option ${index + 1}`;
      if (!option || typeof option !== "object") fail(`${name} is invalid.`);
      requireText(option.id, `${name} ID`);
      requireText(option.label, `${name} label`);
      if (optionIds.has(option.id)) fail(`${scenario.id} has duplicate option ID: ${option.id}.`);
      if (optionLabels.has(option.label)) fail(`${scenario.id} has duplicate option label: ${option.label}.`);
      optionIds.add(option.id);
      optionLabels.add(option.label);
    }
    requireText(scenario.correctTypeId, `${scenario.id} correctTypeId`);
    if (!optionIds.has(scenario.correctTypeId)) fail(`${scenario.id} correctTypeId is not an option.`);
    const feedback = scenario.feedbackByOption;
    if (!feedback || typeof feedback !== "object" || Array.isArray(feedback)) {
      fail(`${scenario.id} needs feedbackByOption for every type option.`);
    }
    const feedbackKeys = Object.keys(feedback);
    if (feedbackKeys.length !== optionIds.size || feedbackKeys.some((id) => !optionIds.has(id))) {
      fail(`${scenario.id} feedbackByOption keys must exactly match option IDs.`);
    }
    for (const optionId of optionIds) requireText(feedback[optionId], `${scenario.id} feedbackByOption.${optionId}`);
  }
}
