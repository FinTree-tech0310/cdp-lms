import { VARIANT_OPTIONS } from "./variant-options";
import type { VariantOptionId } from "./variant-perception-types";
export function shuffleVariantOptions(random: () => number = Math.random): VariantOptionId[] {
  const ids = VARIANT_OPTIONS.map(option => option.optionId);
  for (let index = ids.length - 1; index > 0; index--) {
    const draw = random();
    if (!Number.isFinite(draw) || draw < 0 || draw >= 1) throw new Error("Shuffle randomness must be in [0, 1).");
    const other = Math.floor(draw * (index + 1));
    [ids[index], ids[other]] = [ids[other], ids[index]];
  }
  return ids;
}
