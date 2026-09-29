import type { Metadata } from "next";

import { RebalanceTheDrift } from "./RebalanceTheDrift";

export const metadata: Metadata = {
  title: "Rebalance the Drift | Private Wealth Mini-Games",
  description: "Bring a client portfolio back toward its authored target allocation.",
};

export default function RebalanceTheDriftPage() {
  return <RebalanceTheDrift />;
}
