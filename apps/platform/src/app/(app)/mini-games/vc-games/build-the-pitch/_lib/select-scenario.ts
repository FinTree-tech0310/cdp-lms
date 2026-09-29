import {
  DEAL_ROOM_SECTIONS,
  type DealRoomSection,
  type MathPuzzleScenario,
  type MetricTile,
} from "../_data/math-puzzle-scenarios";

export function shuffleItems<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function ordersMatch(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

export function shuffleTiles(
  tiles: readonly MetricTile[],
  previousOrder: readonly string[] = [],
): MetricTile[] {
  const shuffled = shuffleItems(tiles);

  if (shuffled.length > 1 && ordersMatch(shuffled.map((tile) => tile.id), previousOrder)) {
    const firstTile = shuffled.shift();
    if (firstTile) shuffled.push(firstTile);
  }

  return shuffled;
}

export function selectSection(
  scenarios: readonly MathPuzzleScenario[],
  seenSectionIds: readonly DealRoomSection[],
): { section: DealRoomSection; seenSectionIds: DealRoomSection[] } {
  if (scenarios.length === 0) throw new Error("Build the Pitch requires at least one scenario.");

  const availableSections = DEAL_ROOM_SECTIONS.filter((section) =>
    scenarios.some((scenario) => scenario.section === section),
  );
  const normalizedSeen = [...new Set(seenSectionIds)].filter((section) =>
    availableSections.includes(section),
  );
  const unseenSections = availableSections.filter((section) => !normalizedSeen.includes(section));
  const cycleHistory = unseenSections.length > 0 ? normalizedSeen : [];
  const candidates = unseenSections.length > 0 ? unseenSections : availableSections;
  const section = candidates[Math.floor(Math.random() * candidates.length)];

  return { section, seenSectionIds: [...cycleHistory, section] };
}

export function selectScenarioWithinSection(
  scenarios: readonly MathPuzzleScenario[],
  section: DealRoomSection,
  seenScenarioIdsBySection: Readonly<Partial<Record<DealRoomSection, string[]>>>,
): {
  scenario: MathPuzzleScenario;
  seenScenarioIdsBySection: Partial<Record<DealRoomSection, string[]>>;
} {
  const sectionScenarios = scenarios.filter((scenario) => scenario.section === section);
  if (sectionScenarios.length === 0) {
    throw new Error(`Build the Pitch requires a scenario for ${section}.`);
  }

  const validScenarioIds = new Set(sectionScenarios.map((scenario) => scenario.id));
  const sectionHistory = [...new Set(seenScenarioIdsBySection[section] ?? [])].filter((id) =>
    validScenarioIds.has(id),
  );
  const unseenScenarios = sectionScenarios.filter(
    (scenario) => !sectionHistory.includes(scenario.id),
  );
  const cycleHistory = unseenScenarios.length > 0 ? sectionHistory : [];
  const candidates = unseenScenarios.length > 0 ? unseenScenarios : sectionScenarios;
  const scenario = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    scenario,
    seenScenarioIdsBySection: {
      ...seenScenarioIdsBySection,
      [section]: [...cycleHistory, scenario.id],
    },
  };
}
