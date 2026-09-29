import type { Metadata } from "next";

import { AnalystNoteEditor } from "./AnalystNoteEditor";

export const metadata: Metadata = {
  title: "The Analyst Note Editor | Equity Research Mini-Games",
  description:
    "Review an authored draft equity research note for evidence, independence, and analytical discipline.",
};

export default function AnalystNoteEditorPage() {
  return <AnalystNoteEditor />;
}
