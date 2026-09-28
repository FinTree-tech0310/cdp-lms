import { Gamepad2 } from "lucide-react";

import { InTheWorksPage } from "@/components/placeholder/in-the-works-page";

export default function MiniGamesPage() {
  return (
    <InTheWorksPage
      eyebrow="Practice"
      title="Learn by playing."
      intro="Five-minute games that drill the fundamentals — markets, valuation and the math underneath them."
      icon={Gamepad2}
      heading="Mini games in the works"
      body="The first games are in production. Until they ship, the quizzes inside the Investment Banking syllabus are the quickest way to test yourself."
      cta={{ href: "/careers", label: "Try a syllabus quiz" }}
    />
  );
}
