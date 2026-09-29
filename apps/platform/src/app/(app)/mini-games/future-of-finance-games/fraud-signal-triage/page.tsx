import type { Metadata } from "next";

import { FraudSignalTriage } from "./FraudSignalTriage";

export const metadata: Metadata = {
  title: "Fraud Signal Triage | Future of Finance Mini-Games",
  description: "Review transaction signals and make operational payments risk decisions.",
};

export default function FraudSignalTriagePage() {
  return <FraudSignalTriage />;
}
