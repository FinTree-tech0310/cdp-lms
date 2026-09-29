import type { Metadata } from "next";

import { TheReferenceCall } from "./TheReferenceCall";

export const metadata: Metadata = {
  title: "The Reference Call | The Deal Room",
  description: "Listen to an authored reference call or founder pitch and judge subtle diligence signals.",
};

export default function TheReferenceCallPage() {
  return <TheReferenceCall />;
}
