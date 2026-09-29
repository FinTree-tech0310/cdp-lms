import type { Metadata } from "next";

import { ReadTheChart } from "./ReadTheChart";

export const metadata: Metadata = {
  title: "Read the Chart | Equity Research Mini-Games",
  description:
    "Interpret how the market reacted to an authored earnings release.",
};

export default function ReadTheChartPage() {
  return <ReadTheChart />;
}
