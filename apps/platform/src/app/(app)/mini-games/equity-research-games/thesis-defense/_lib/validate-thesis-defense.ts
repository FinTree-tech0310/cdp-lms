import { selectDefenseEndingType } from "./score-thesis-defense";
import type {
  DefenseEndingType,
  DefenseQuestionNumber,
  ThesisDefenseScenario,
} from "./thesis-defense-types";

const REQUIRED_QUESTION_NUMBERS: readonly DefenseQuestionNumber[] = [
  1,
  2,
  3,
  4,
];

function contentError(message: string): never {
  throw new Error(`Thesis Defense content error: ${message}`);
}

function requireText(value: string, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    contentError(`${field} must be non-empty.`);
  }
}

function enumeratePossibleScores(scenario: ThesisDefenseScenario): number[] {
  let totals = [0];
  for (const question of scenario.questions) {
    totals = totals.flatMap((total) =>
      question.options.map((option) => total + option.scoreImpact),
    );
  }
  return [...new Set(totals)].sort((a, b) => a - b);
}

function validateEndingReachability(scenario: ThesisDefenseScenario): void {
  const possibleScores = enumeratePossibleScores(scenario);
  const reachable = new Set<DefenseEndingType>(
    possibleScores.map((score) => selectDefenseEndingType(score, scenario)),
  );
  const endingTypes: readonly DefenseEndingType[] = [
    "convinced",
    "skeptical",
    "unconvinced",
  ];

  for (const endingType of endingTypes) {
    if (reachable.has(endingType)) continue;
    const minimum = possibleScores[0];
    const maximum = possibleScores[possibleScores.length - 1];
    contentError(
      `scenario "${scenario.id}" cannot reach ending "${endingType}"; reachable score range is ${minimum} to ${maximum}, with totals [${possibleScores.join(
        ", ",
      )}].`,
    );
  }
}

export function validateThesisDefenseScenarios(
  scenarios: readonly ThesisDefenseScenario[],
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
    requireText(scenario.stockContext, `${scenarioPrefix} stockContext`);
    requireText(scenario.ratingSummary, `${scenarioPrefix} ratingSummary`);
    requireText(
      scenario.endingConvinced,
      `${scenarioPrefix} endingConvinced`,
    );
    requireText(
      scenario.endingSkeptical,
      `${scenarioPrefix} endingSkeptical`,
    );
    requireText(
      scenario.endingUnconvinced,
      `${scenarioPrefix} endingUnconvinced`,
    );

    if (!Number.isFinite(scenario.thresholdLow)) {
      contentError(`${scenarioPrefix} thresholdLow must be finite.`);
    }
    if (!Number.isFinite(scenario.thresholdHigh)) {
      contentError(`${scenarioPrefix} thresholdHigh must be finite.`);
    }
    if (scenario.thresholdLow >= scenario.thresholdHigh) {
      contentError(`${scenarioPrefix} thresholdLow must be below thresholdHigh.`);
    }
    if (scenario.questions.length !== 4) {
      contentError(`${scenarioPrefix} must contain exactly 4 questions.`);
    }

    const questionIds = new Set<string>();
    const questionNumbers = new Set<number>();

    scenario.questions.forEach((question, questionIndex) => {
      const questionPrefix = `${scenarioPrefix}, question ${questionIndex + 1}`;
      requireText(question.id, `${questionPrefix} id`);
      if (questionIds.has(question.id)) {
        contentError(`${scenarioPrefix} has duplicate question id "${question.id}".`);
      }
      questionIds.add(question.id);

      if (!REQUIRED_QUESTION_NUMBERS.includes(question.questionNumber)) {
        contentError(`${questionPrefix} questionNumber must be 1, 2, 3, or 4.`);
      }
      if (questionNumbers.has(question.questionNumber)) {
        contentError(
          `${scenarioPrefix} has duplicate questionNumber ${question.questionNumber}.`,
        );
      }
      questionNumbers.add(question.questionNumber);
      requireText(question.pmQuestionText, `${questionPrefix} pmQuestionText`);

      if (question.options.length !== 3) {
        contentError(`${questionPrefix} must contain exactly 3 options.`);
      }

      const optionIds = new Set<string>();
      question.options.forEach((option, optionIndex) => {
        const optionPrefix = `${questionPrefix}, option ${optionIndex + 1}`;
        requireText(option.id, `${optionPrefix} id`);
        if (optionIds.has(option.id)) {
          contentError(`${questionPrefix} has duplicate option id "${option.id}".`);
        }
        optionIds.add(option.id);
        requireText(option.label, `${optionPrefix} label`);
        requireText(option.pmReaction, `${optionPrefix} pmReaction`);
        if (!Number.isFinite(option.scoreImpact)) {
          contentError(`${optionPrefix} scoreImpact must be finite.`);
        }
      });
    });

    const missingNumbers = REQUIRED_QUESTION_NUMBERS.filter(
      (questionNumber) => !questionNumbers.has(questionNumber),
    );
    if (missingNumbers.length > 0) {
      contentError(
        `${scenarioPrefix} is missing questionNumber ${missingNumbers.join(", ")}.`,
      );
    }

    validateEndingReachability(scenario);
  }
}
