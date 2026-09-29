export interface CodeLine {
  id: string;
  lineNumber: number;
  code: string;
  isVulnerableLine: boolean;
  lineExplanation: string;
}

export interface VulnerabilityTypeOption {
  id: string;
  label: string;
}

export interface SmartContractScenario {
  id: string;
  functionContext: string;
  lines: CodeLine[];
  vulnerableLineId: string;
  vulnerabilityTypeOptions: VulnerabilityTypeOption[];
  correctTypeId: string;
  feedbackByOption: Record<string, string>;
}

export interface CodeLineReviewRecord {
  id: string;
  lineNumber: number;
  code: string;
  isVulnerableLine: boolean;
  lineExplanation: string;
  wasLearnerSelected: boolean;
}

export interface SmartContractResultSnapshot {
  scenarioId: string;
  functionContext: string;
  lines: CodeLineReviewRecord[];
  selectedLineId: string;
  vulnerableLineId: string;
  lineMatched: boolean;
  selectedTypeId: string;
  selectedTypeLabel: string;
  correctTypeId: string;
  correctTypeLabel: string;
  typeMatched: boolean;
  selectedTypeFeedback: string;
  displayTypeOptionIds: string[];
}
