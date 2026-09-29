import type { Metadata } from "next";

import { ThePitchSprint } from "./ThePitchSprint";

export const metadata: Metadata = {
  title: "The Pitch Sprint | The Deal Room",
  description: "Screen five anonymized startup pitches, then reveal the companies behind them.",
};

export default function ThePitchSprintPage() {
  return <ThePitchSprint />;
}
