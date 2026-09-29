import type { CompsCandidate } from "../_data/comps-scenarios";

function ordersMatch(left: readonly string[], right: readonly string[]) {
  return left.length === right.length
    && left.every((candidateId, index) => candidateId === right[index]);
}

export function shuffleCompsCandidateIds(
  candidates: readonly CompsCandidate[],
  previousOrder: readonly string[] = [],
  random: () => number = Math.random,
) {
  const shuffled = candidates.map((candidate) => candidate.id);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  if (shuffled.length > 1 && ordersMatch(shuffled, previousOrder)) {
    shuffled.push(shuffled.shift()!);
  }

  return shuffled;
}
