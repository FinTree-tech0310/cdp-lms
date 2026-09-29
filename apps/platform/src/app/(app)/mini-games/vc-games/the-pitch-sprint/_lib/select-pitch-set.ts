import type { PitchSet } from "../_data/pitch-sets";

export function selectPitchSet(
  sets: readonly PitchSet[],
  lastSetId: string | null,
  random: () => number = Math.random,
): PitchSet {
  if (sets.length === 0) {
    throw new Error("The Pitch Sprint requires at least one pitch set.");
  }

  const eligibleSets = sets.length > 1 ? sets.filter((set) => set.id !== lastSetId) : sets;
  const selectionIndex = Math.floor(random() * eligibleSets.length);
  return eligibleSets[selectionIndex];
}

export function shufflePitchSetCards(
  pitchSet: PitchSet,
  random: () => number = Math.random,
): PitchSet {
  const cards = [...pitchSet.cards];

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }

  return { ...pitchSet, cards };
}
