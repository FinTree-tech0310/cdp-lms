export type TriageAction = "approve" | "stepUpVerify" | "blockEscalate";

export interface TransactionSignal {
  label: string;
  value: string;
}

export interface TriageTransaction {
  id: string;
  signals: TransactionSignal[];
  recommendedAction: TriageAction;
  feedbackByAction: Record<TriageAction, string>;
}

export interface FraudTriageScenarioSet {
  id: string;
  setContext: string;
  transactions: TriageTransaction[];
}

export type TransactionAssignments = Record<string, TriageAction | undefined>;

export interface TriageReviewRecord {
  transactionId: string;
  signals: TransactionSignal[];
  learnerAction: TriageAction;
  recommendedAction: TriageAction;
  matched: boolean;
  feedback: string;
}

export interface FraudTriageResultSnapshot {
  scenarioId: string;
  setContext: string;
  transactions: TriageReviewRecord[];
}
