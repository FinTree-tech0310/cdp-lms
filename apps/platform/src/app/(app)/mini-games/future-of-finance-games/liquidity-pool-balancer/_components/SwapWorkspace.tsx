import type { Ref } from "react";
import { formatOutputAmount, formatPriceImpact, formatSwapAmount } from "../_lib/format-swap-values";
import type { LiquidityPoolScenario, SwapOutputs } from "../_lib/liquidity-pool-types";
import styles from "../liquidity-pool-balancer.module.css";

export function SwapWorkspace({ scenario, swapAmount, outputs, headingRef, onAmountChange, onSubmit }: {
  scenario: LiquidityPoolScenario;
  swapAmount: number;
  outputs: SwapOutputs;
  headingRef: Ref<HTMLHeadingElement>;
  onAmountChange: (amount: number) => void;
  onSubmit: () => void;
}) {
  return (
    <section className={styles.workspace} aria-labelledby="liquidity-pool-workspace-title">
      <header className={styles.workspaceHeader}>
        <p className={styles.eyebrow}>Pool execution · Treasury decision</p>
        <h1 id="liquidity-pool-workspace-title" ref={headingRef} tabIndex={-1}>Balance the swap.</h1>
        <p>More input receives more output, but changes the execution price further from the pool’s starting price.</p>
      </header>
      <div className={styles.contextGrid}>
        <section className={styles.contextPanel} aria-labelledby="treasury-context-title">
          <h2 id="treasury-context-title" className={styles.panelLabel}>Treasury context</h2>
          <p>{scenario.treasuryContextNote}</p>
        </section>
        <section className={styles.contextPanel} aria-labelledby="execution-requirement-title">
          <h2 id="execution-requirement-title" className={styles.panelLabel}>Execution requirement</h2>
          <p>{scenario.executionRequirement}</p>
        </section>
      </div>
      <div className={styles.decisionGrid}>
        <section className={styles.poolPanel} aria-labelledby="pool-liquidity-title">
          <h2 id="pool-liquidity-title" className={styles.panelLabel}>Pool liquidity</h2>
          <dl className={styles.reserveGrid}>
            <div><dt>{scenario.tokenInLabel} reserve</dt><dd>{formatSwapAmount(scenario.reserveIn)}</dd></div>
            <div><dt>{scenario.tokenOutLabel} reserve</dt><dd>{formatSwapAmount(scenario.reserveOut)}</dd></div>
          </dl>
          <div className={styles.swapControl}>
            <div className={styles.swapControlHeading}>
              <label htmlFor="liquidity-swap-amount">Swap amount</label>
              <strong>{formatSwapAmount(swapAmount)} <span>{scenario.tokenInLabel}</span></strong>
            </div>
            <input
              id="liquidity-swap-amount"
              className={styles.range}
              type="range"
              min={scenario.sliderMin}
              max={scenario.sliderMax}
              step={scenario.sliderStep}
              value={swapAmount}
              aria-valuetext={`${formatSwapAmount(swapAmount)} ${scenario.tokenInLabel}`}
              onChange={(event) => onAmountChange(Number(event.currentTarget.value))}
            />
            <div className={styles.rangeEnds} aria-hidden="true">
              <span>{formatSwapAmount(scenario.sliderMin)} {scenario.tokenInLabel}</span>
              <span>{formatSwapAmount(scenario.sliderMax)} {scenario.tokenInLabel}</span>
            </div>
          </div>
        </section>
        <section className={styles.outputPanel} aria-labelledby="live-output-title">
          <h2 id="live-output-title" className={styles.panelLabel}>Your current swap</h2>
          <dl className={styles.outputGrid}>
            <div><dt>You swap</dt><dd>{formatSwapAmount(swapAmount)} <span>{scenario.tokenInLabel}</span></dd></div>
            <div><dt>You receive</dt><dd>{formatOutputAmount(outputs.amountOut)} <span>{scenario.tokenOutLabel}</span></dd></div>
            <div><dt>Price impact</dt><dd>{formatPriceImpact(outputs.priceImpactPercent)}%</dd></div>
          </dl>
          <p className={styles.modelNote}>Displayed values model one zero-fee constant-product pool. They update as you adjust the swap.</p>
          <button className={styles.primaryButton} type="button" onClick={onSubmit}>Submit Swap</button>
          <p className={styles.submitHelp}>You may submit the starting amount without changing it.</p>
        </section>
      </div>
    </section>
  );
}
