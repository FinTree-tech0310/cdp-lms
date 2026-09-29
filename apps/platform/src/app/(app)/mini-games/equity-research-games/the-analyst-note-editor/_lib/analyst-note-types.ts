export interface NoteLine {
  id: string;
  text: string;
  isProblematic: boolean;
  reasoning: string;
}

export interface AnalystNoteScenario {
  id: string;
  noteContext: string;
  lines: NoteLine[];
}

export interface NoteReviewRecord {
  readonly lineId: string;
  readonly text: string;
  readonly learnerFlagged: boolean;
  readonly isProblematic: boolean;
  readonly matched: boolean;
  readonly reasoning: string;
}

export interface AnalystNoteResultSnapshot {
  readonly scenarioId: string;
  readonly lines: readonly NoteReviewRecord[];
}
