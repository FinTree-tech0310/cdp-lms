import type {
  DefenseAnswerOption,
  DefenseOptionDisplayOrder,
} from "./thesis-defense-types";

export function shuffleDefenseOptionIds(
  options: readonly DefenseAnswerOption[],
  random: () => number = Math.random,
): DefenseOptionDisplayOrder {
  if (options.length !== 3) {
    throw new Error("Thesis Defense questions must contain exactly three options.");
  }

  const ids = options.map((option) => option.id);
  for (let index = ids.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
  }

  return [ids[0], ids[1], ids[2]];
}
