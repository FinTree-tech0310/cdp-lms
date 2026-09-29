import type { Metadata } from "next";

import { FounderInterrogation } from "../founder-interrogation-dev/FounderInterrogation";

export const metadata: Metadata = {
  title: "Founder Interrogation | The Deal Room",
  description: "Watch an anonymous founder pitch, make the investment call, and reveal the idea.",
};

export default function FounderInterrogationPage() {
  return <FounderInterrogation />;
}
