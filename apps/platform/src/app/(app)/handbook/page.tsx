import { BookOpen } from "lucide-react";

import { InTheWorksPage } from "@/components/placeholder/in-the-works-page";

export default function HandbookPage() {
  return (
    <InTheWorksPage
      eyebrow="Reference"
      title="The handbook."
      intro="Checklists, templates and how-tos for every step of your career search — written to sit beside the tracks, not repeat them."
      icon={BookOpen}
      heading="Handbook in the works"
      body="The first chapters are being drafted now. Until they land, the Investment Banking syllabus on Careers carries the same notes, lesson by lesson."
      cta={{ href: "/careers", label: "Open the syllabus" }}
    />
  );
}
