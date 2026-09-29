import type { Metadata } from "next";

import { FootballFieldBuilder } from "./FootballFieldBuilder";

export const metadata: Metadata = {
  title: "Football Field Builder | Investment Banking Mini-Games",
  description: "Build and interpret a shared valuation football field.",
};

export default function FootballFieldBuilderPage() {
  return <FootballFieldBuilder />;
}
