import type { Metadata } from "next";

import { SmartContractAudit } from "./SmartContractAudit";

export const metadata: Metadata = {
  title: "Smart Contract Audit | Future of Finance Mini-Games",
  description: "Review simplified contract pseudocode, identify a vulnerable line, and classify the issue.",
};

export default function SmartContractAuditPage() {
  return <SmartContractAudit />;
}
