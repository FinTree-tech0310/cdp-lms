import type { AnalystNoteScenario } from "./analyst-note-types";

function contentError(message: string): never {
  throw new Error(`The Analyst Note Editor content error: ${message}`);
}

function requireText(value: string, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    contentError(`${field} must be non-empty.`);
  }
}

export function validateAnalystNoteScenarios(
  scenarios: readonly AnalystNoteScenario[],
): void {
  if (scenarios.length === 0) {
    contentError("at least one scenario is required.");
  }

  const scenarioIds = new Set<string>();

  for (const scenario of scenarios) {
    requireText(scenario.id, "scenario id");
    if (scenarioIds.has(scenario.id)) {
      contentError(`duplicate scenario id "${scenario.id}".`);
    }
    scenarioIds.add(scenario.id);

    const scenarioPrefix = `scenario "${scenario.id}"`;
    requireText(scenario.noteContext, `${scenarioPrefix} noteContext`);
    if (!Array.isArray(scenario.lines) || scenario.lines.length < 1) {
      contentError(`${scenarioPrefix} must contain at least 1 line.`);
    }

    const lineIds = new Set<string>();
    scenario.lines.forEach((line, index) => {
      const linePrefix = `${scenarioPrefix}, line ${index + 1}`;
      requireText(line.id, `${linePrefix} id`);
      if (lineIds.has(line.id)) {
        contentError(`${scenarioPrefix} has duplicate line id "${line.id}".`);
      }
      lineIds.add(line.id);
      requireText(line.text, `${linePrefix} text`);
      if (typeof line.isProblematic !== "boolean") {
        contentError(`${linePrefix} isProblematic must be boolean.`);
      }
      requireText(line.reasoning, `${linePrefix} reasoning`);
    });
  }
}
