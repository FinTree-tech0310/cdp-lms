import type { ReactNode } from "react";

import { MiniGameShell } from "@/components/mini-games/MiniGameShell";

interface VcGameShellProps {
  gameLabel: string;
  rightContent?: ReactNode;
  backLabel?: string;
  onBack?: () => void;
  children: ReactNode;
}

export function VcGameShell({ gameLabel, rightContent, backLabel = "The Deal Room", onBack, children }: VcGameShellProps) {
  return (
    <MiniGameShell
      gameLabel={gameLabel}
      hubHref="/mini-games/vc-games"
      rightContent={rightContent}
      backLabel={backLabel}
      onBack={onBack}
    >
      {children}
    </MiniGameShell>
  );
}
