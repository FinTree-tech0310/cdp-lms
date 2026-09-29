export type VariantOptionId = "publishBold" | "publishSoftened" | "stayConsensus";
export interface VariantOption { optionId: VariantOptionId; outcome: string }
export interface VariantPerceptionScenario { id: string; setupContext: string; options: VariantOption[] }
export interface VariantResultSnapshot {
  readonly scenarioId: string;
  readonly selectedOptionId: VariantOptionId;
  readonly optionDisplayOrder: readonly VariantOptionId[];
  readonly selectedOutcome: string;
  readonly alternativeOutcomes: readonly Readonly<VariantOption>[];
}
