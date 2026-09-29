import type { Metadata } from "next";

import { DealSpeedRound } from "./DealSpeedRound";

export const metadata: Metadata = {
  title: "Deal Speed Round | The Deal Room",
  description: "Make eight rapid-fire venture capital screening decisions against the clock.",
};

export default function DealSpeedRoundPage() {
  return <DealSpeedRound />;
}
