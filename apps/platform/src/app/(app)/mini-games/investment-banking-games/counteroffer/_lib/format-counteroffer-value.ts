import type { LeverId, NegotiationLever } from "./counteroffer-types";

export function formatCounterofferValue(
  lever: Pick<NegotiationLever, "id" | "unit" | "options">,
  value: number,
) {
  if (lever.id === "price") return `$${value}M`;
  if (lever.id === "earnoutMonths") return `${value} ${value === 1 ? "month" : "months"}`;
  return lever.options?.find((option) => option.value === value)?.label
    ?? "Governance option unavailable";
}

export function formatLeverValueById(
  id: LeverId,
  value: number,
  governanceLabel?: string,
) {
  if (id === "price") return `$${value}M`;
  if (id === "earnoutMonths") return `${value} ${value === 1 ? "month" : "months"}`;
  return governanceLabel ?? "Governance option unavailable";
}
