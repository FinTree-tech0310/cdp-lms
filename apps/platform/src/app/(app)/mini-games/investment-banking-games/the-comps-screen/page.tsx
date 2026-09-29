import type { Metadata } from "next";

import { TheCompsScreen } from "./TheCompsScreen";

export const metadata: Metadata = {
  title: "The Comps Screen | Investment Banking Mini-Games",
  description:
    "Screen comparable companies against an authored investment-banking mandate.",
};

export default function TheCompsScreenPage() {
  return <TheCompsScreen />;
}
