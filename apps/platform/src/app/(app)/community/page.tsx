import { Users } from "lucide-react";

import { InTheWorksPage } from "@/components/placeholder/in-the-works-page";

export default function CommunityPage() {
  return (
    <InTheWorksPage
      eyebrow="People"
      title="Your cohort, together."
      intro="Threads, accountability circles and mentor office hours — one place for the people on the same journey as you."
      icon={Users}
      heading="Community in the works"
      body="We're opening membership in small groups first. Until then, your cohort meets live in the Expinar sessions on your dashboard."
      cta={{ href: "/dashboard", label: "See upcoming Expinars" }}
    />
  );
}
