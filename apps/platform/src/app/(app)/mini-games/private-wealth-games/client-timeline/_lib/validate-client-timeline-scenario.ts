import type {
  ApproachTag,
  ClientTimelineScenario,
} from "../_data/client-timeline-scenarios";

const APPROACH_TAGS = new Set<ApproachTag>(["disciplined", "reactive"]);

function requireText(value: string, message: string): void {
  if (value.trim().length === 0) throw new Error(message);
}

export function validateClientTimelineScenario(
  scenario: ClientTimelineScenario,
): void {
  requireText(scenario.id, "Client Timeline scenario needs an ID.");
  requireText(
    scenario.clientAvatarSeed,
    `Client Timeline scenario ${scenario.id} needs a clientAvatarSeed.`,
  );
  requireText(
    scenario.clientName,
    `Client Timeline scenario ${scenario.id} needs a clientName.`,
  );
  requireText(
    scenario.introText,
    `Client Timeline scenario ${scenario.id} needs introText.`,
  );
  requireText(
    scenario.endingMostlyDisciplined,
    `Client Timeline scenario ${scenario.id} needs its disciplined ending.`,
  );
  requireText(
    scenario.endingMostlyReactive,
    `Client Timeline scenario ${scenario.id} needs its reactive ending.`,
  );

  if (scenario.stops.length !== 3) {
    throw new Error(`Client Timeline scenario ${scenario.id} must contain three stops.`);
  }

  const stopIds = new Set<string>();
  const optionIds = new Set<string>();
  for (const stop of scenario.stops) {
    requireText(stop.id, `Client Timeline scenario ${scenario.id} has a stop without an ID.`);
    if (stopIds.has(stop.id)) {
      throw new Error(`Client Timeline scenario ${scenario.id} has duplicate stop ID ${stop.id}.`);
    }
    stopIds.add(stop.id);
    requireText(stop.stopLabel, `Client Timeline stop ${stop.id} needs a stopLabel.`);
    requireText(stop.yearMarker, `Client Timeline stop ${stop.id} needs a yearMarker.`);
    requireText(stop.storyBeat, `Client Timeline stop ${stop.id} needs a storyBeat.`);

    if (stop.options.length !== 2) {
      throw new Error(`Client Timeline stop ${stop.id} must contain two options.`);
    }

    for (const option of stop.options) {
      requireText(option.id, `Client Timeline stop ${stop.id} has an option without an ID.`);
      if (optionIds.has(option.id)) {
        throw new Error(
          `Client Timeline scenario ${scenario.id} has duplicate option ID ${option.id}.`,
        );
      }
      optionIds.add(option.id);
      requireText(option.label, `Client Timeline option ${option.id} needs a label.`);
      requireText(
        option.immediateConsequence,
        `Client Timeline option ${option.id} needs an immediateConsequence.`,
      );
      if (!APPROACH_TAGS.has(option.approachTag)) {
        throw new Error(`Client Timeline option ${option.id} has an invalid approachTag.`);
      }
    }
  }
}

export function validateClientTimelineScenarios(
  scenarios: readonly ClientTimelineScenario[],
): void {
  if (scenarios.length === 0) {
    throw new Error("Client Timeline needs at least one scenario.");
  }
  const scenarioIds = new Set<string>();
  for (const scenario of scenarios) {
    validateClientTimelineScenario(scenario);
    if (scenarioIds.has(scenario.id)) {
      throw new Error(`Client Timeline has duplicate scenario ID ${scenario.id}.`);
    }
    scenarioIds.add(scenario.id);
  }
}
