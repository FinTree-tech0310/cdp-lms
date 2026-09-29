import type { Ref } from "react";
import { ENTRY_RULES, EXIT_RULES } from "../_lib/trading-rules";
import type { EntryRuleId, ExitRuleId } from "../_lib/trading-types";
import { RuleGroup } from "./RuleGroup";
import styles from "../build-the-trading-algorithm.module.css";

export function TradingWorkspace({ marketContext, selectedEntryRuleId, selectedExitRuleId, headingRef, onEntrySelect, onExitSelect, onRun }: {
  marketContext: string;
  selectedEntryRuleId: EntryRuleId | null;
  selectedExitRuleId: ExitRuleId | null;
  headingRef: Ref<HTMLHeadingElement>;
  onEntrySelect: (id: EntryRuleId) => void;
  onExitSelect: (id: ExitRuleId) => void;
  onRun: () => void;
}) {
  return (
    <section className={styles.workspace} aria-labelledby="trading-workspace-title">
      <header className={styles.workspaceHeader}>
        <p className={styles.eyebrow}>Strategy experiment · Rule selection</p>
        <h1 id="trading-workspace-title" ref={headingRef} tabIndex={-1}>Set the rules.</h1>
        <p>Choose one entry rule and one exit rule, then run them against an unseen market period to see how the strategy behaves. There is no hidden correct combination.</p>
      </header>
      <section className={styles.contextPanel} aria-labelledby="trading-context-title">
        <h2 id="trading-context-title" className={styles.panelLabel}>Market context</h2>
        <p>{marketContext}</p>
      </section>
      <div className={styles.ruleGrid}>
        <RuleGroup title="Entry rule" name="trading-entry-rule" rules={ENTRY_RULES} selectedId={selectedEntryRuleId} onSelect={onEntrySelect} />
        <RuleGroup title="Exit rule" name="trading-exit-rule" rules={EXIT_RULES} selectedId={selectedExitRuleId} onSelect={onExitSelect} />
      </div>
      <div className={styles.workspaceActions}>
        <p id="trading-run-help">{selectedEntryRuleId && selectedExitRuleId ? "Both rules are selected. Run when ready." : "Select one rule in each group to enable Run Strategy."}</p>
        <button className={styles.primaryButton} type="button" disabled={!selectedEntryRuleId || !selectedExitRuleId} aria-describedby="trading-run-help" onClick={onRun}>Run Strategy</button>
      </div>
    </section>
  );
}
