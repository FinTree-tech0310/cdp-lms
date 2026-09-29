export type DefenseQuestionNumber = 1 | 2 | 3 | 4;

export interface DefenseAnswerOption {
  id: string;
  label: string;
  scoreImpact: number;
  pmReaction: string;
}

export interface DefenseQuestion {
  id: string;
  questionNumber: DefenseQuestionNumber;
  pmQuestionText: string;
  options: DefenseAnswerOption[];
}

export interface ThesisDefenseScenario {
  id: string;
  stockContext: string;
  ratingSummary: string;
  questions: DefenseQuestion[];
  thresholdHigh: number;
  thresholdLow: number;
  endingConvinced: string;
  endingSkeptical: string;
  endingUnconvinced: string;
}

export interface DefenseAnswerRecord {
  readonly questionId: string;
  readonly questionNumber: DefenseQuestionNumber;
  readonly pmQuestionText: string;
  readonly selectedOptionId: string;
  readonly selectedOptionLabel: string;
  readonly scoreImpact: number;
  readonly pmReaction: string;
}

export type DefenseEndingType =
  | "convinced"
  | "skeptical"
  | "unconvinced";

export type DefenseOptionDisplayOrder = readonly [string, string, string];

export interface DefenseResultSnapshot {
  readonly scenarioId: string;
  readonly answerHistory: readonly DefenseAnswerRecord[];
  readonly totalScore: number;
  readonly endingType: DefenseEndingType;
  readonly endingText: string;
}

export const DEFENSE_ENDING_LABELS: Readonly<
  Record<DefenseEndingType, string>
> = {
  convinced: "PM Convinced",
  skeptical: "PM Still Skeptical",
  unconvinced: "PM Unconvinced",
};
