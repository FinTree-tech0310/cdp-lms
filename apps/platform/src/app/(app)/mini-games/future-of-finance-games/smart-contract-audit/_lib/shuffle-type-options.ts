export function shuffleTypeOptionIds(
  optionIds: readonly string[],
  random: () => number = Math.random,
): string[] {
  const shuffled = [...optionIds];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}
