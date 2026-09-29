import type { Metadata } from "next";

import { ThesisDefense } from "./ThesisDefense";

export const metadata: Metadata = {
  title: "Thesis Defense | Equity Research Mini-Games",
  description:
    "Defend an authored investment thesis across a four-question portfolio manager meeting.",
};

export default function ThesisDefensePage() {
  return <ThesisDefense />;
}
