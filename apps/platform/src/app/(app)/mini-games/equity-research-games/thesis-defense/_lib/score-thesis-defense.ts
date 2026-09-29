import type {
  DefenseAnswerRecord,
  DefenseEndingType,
  DefenseResultSnapshot,
  ThesisDefenseScenario,
} from "./thesis-defense-types";

export function selectDefenseEndingType(
  totalScore: number,
  scenario: Pick<
    ThesisDefenseScenario,
    "thresholdHigh" | "thresholdLow"
  >,
): DefenseEndingType {
  if (totalScore >= scenario.thresholdHigh) return "convinced";
  if (totalScore <= scenario.thresholdLow) return "unconvinced";
  return "skeptical";
}

function endingTextForType(
  scenario: ThesisDefenseScenario,
  endingType: DefenseEndingType,
): string {
  if (endingType === "convinced") return scenario.endingConvinced;
  if (endingType === "unconvinced") return scenario.endingUnconvinced;
  return scenario.endingSkeptical;
}

export function createDefenseResultSnapshot(
  scenario: ThesisDefenseScenario,
  answerHistory: readonly DefenseAnswerRecord[],
): DefenseResultSnapshot {
  if (answerHistory.length !== 4) {
    throw new Error(
      "Thesis Defense requires exactly four locked answers before assessment.",
    );
  }

  const totalScore = answerHistory.reduce(
    (total, answer) => total + answer.scoreImpact,
    0,
  );
  const endingType = selectDefenseEndingType(totalScore, scenario);
  const frozenHistory = Object.freeze([...answerHistory]);

  return Object.freeze({
    scenarioId: scenario.id,
    answerHistory: frozenHistory,
    totalScore,
    endingType,
    endingText: endingTextForType(scenario, endingType),
  });
}
