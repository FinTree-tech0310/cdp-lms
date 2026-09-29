import type { Metadata } from "next";

import { ClientDossier } from "./ClientDossier";

export const metadata: Metadata = {
  title: "Client Dossier | Private Wealth Mini-Games",
  description: "Review a client's request against the context that matters.",
};

export default function ClientDossierPage() {
  return <ClientDossier />;
}
