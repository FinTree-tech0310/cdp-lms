import type { VariantOptionId } from "./variant-perception-types";
export const VARIANT_OPTIONS: readonly { optionId: VariantOptionId; label: string }[] = Object.freeze([
  Object.freeze({ optionId: "publishBold" as const, label: "Publish the Full Contrarian Call" }),
  Object.freeze({ optionId: "publishSoftened" as const, label: "Publish a Softened, Hedged Version" }),
  Object.freeze({ optionId: "stayConsensus" as const, label: "Stay Silent and Align with Consensus" }),
]);
export function variantLabel(id: VariantOptionId): string {
  return VARIANT_OPTIONS.find(option => option.optionId === id)!.label;
}
export function isVariantOptionId(value: unknown): value is VariantOptionId {
  return VARIANT_OPTIONS.some(option => option.optionId === value);
}
