export function shuffleAnswerOptions(
  options: readonly string[],
  random: () => number = Math.random,
): string[] {
  const displayOrder = [...options];
  for (let index = displayOrder.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [displayOrder[index], displayOrder[swapIndex]] = [displayOrder[swapIndex], displayOrder[index]];
  }
  return displayOrder;
}
