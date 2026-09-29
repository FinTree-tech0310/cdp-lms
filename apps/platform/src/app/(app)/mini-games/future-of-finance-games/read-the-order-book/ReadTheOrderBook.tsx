"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { OrderBookAnswerOptions } from "./_components/OrderBookAnswerOptions";
import { OrderBookChart } from "./_components/OrderBookChart";
import { OrderBookFrame } from "./_components/OrderBookFrame";
import { OrderBookIntro } from "./_components/OrderBookIntro";
import { OrderBookResults } from "./_components/OrderBookResults";
import { orderBookScenarios } from "./_data/order-book-scenarios";
import { ORDER_BOOK_STORAGE_KEY, parseOrderBookPersistence } from "./_lib/order-book-persistence";
import { INITIAL_ORDER_BOOK_STATE, orderBookReducer } from "./_lib/order-book-state";
import { selectOrderBookScenario, validOrderBookSeenIds } from "./_lib/select-order-book-scenario";
import { shuffleAnswerOptions } from "./_lib/shuffle-answer-options";
import { validateOrderBookScenarios } from "./_lib/validate-order-book-scenarios";
import styles from "./read-the-order-book.module.css";

validateOrderBookScenarios(orderBookScenarios);

export function ReadTheOrderBook() {
  const [state, dispatch] = useReducer(orderBookReducer, INITIAL_ORDER_BOOK_STATE);
  const [hydrated, setHydrated] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const workspaceHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ORDER_BOOK_STORAGE_KEY);
      const saved = raw ? parseOrderBookPersistence(JSON.parse(raw)) : null;
      if (saved) {
        dispatch({
          type: "HYDRATE",
          seenScenarioIds: validOrderBookSeenIds(orderBookScenarios, saved.seenScenarioIds),
        });
      }
    } catch {
      // The game remains playable with in-memory seen history.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser history hydration
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(ORDER_BOOK_STORAGE_KEY, JSON.stringify({
        version: 1,
        seenScenarioIds: state.seenScenarioIds,
      }));
    } catch {
      // The game remains playable without browser storage.
    }
  }, [hydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (state.phase === "reading") workspaceHeadingRef.current?.focus({ preventScroll: true });
    if (state.phase === "results") resultsHeadingRef.current?.focus({ preventScroll: true });
  }, [state.phase, state.sessionKey]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results" || !state.resultSnapshot) return;
    const matched = state.resultSnapshot.matched;
    syncResult({
      score: matched ? 100 : 0,
      outcome: matched ? "correct-interpretation" : "incorrect-interpretation",
      completed: true,
    });
  }, [state.phase, state.resultSnapshot, syncResult]);

  const start = useCallback(() => {
    if (!hydrated) return;
    const scenario = selectOrderBookScenario(orderBookScenarios, state.seenScenarioIds);
    dispatch({
      type: "START",
      scenario,
      displayAnswerOptions: shuffleAnswerOptions(scenario.answerOptions),
    });
  }, [hydrated, state.seenScenarioIds]);

  useEntryEnterShortcut(hydrated && state.phase === "ready", start);

  const backToIntro = () => {
    dispatch({ type: "BACK_TO_INTRO" });
    requestAnimationFrame(() => startRef.current?.focus());
  };

  const scenario = state.activeScenario;

  return (
    <OrderBookFrame onBack={state.phase === "ready" ? undefined : backToIntro}>
      {state.phase === "ready" ? (
        <OrderBookIntro ready={hydrated} startRef={startRef} onStart={start} />
      ) : null}
      {state.phase === "reading" && scenario ? (
        <section className={styles.workspace} aria-labelledby="order-book-workspace-title">
          <header className={styles.workspaceHeader}>
            <p className={styles.eyebrow}>Market structure · Order-book snapshot</p>
            <h1 id="order-book-workspace-title" ref={workspaceHeadingRef} tabIndex={-1}>
              Read the depth.
            </h1>
            <p>Use the displayed orders to interpret immediate execution conditions.</p>
          </header>
          <div className={styles.contextPanel}>
            <p className={styles.panelLabel}>Market context</p>
            <p>{scenario.marketContext}</p>
          </div>
          <div className={styles.analysisGrid}>
            <OrderBookChart
              idPrefix="order-book-reading"
              currentPrice={scenario.currentPrice}
              sellOrders={scenario.sellOrders}
              buyOrders={scenario.buyOrders}
              depthDescriptionForScreenReaders={scenario.depthDescriptionForScreenReaders}
            />
            <aside className={styles.answerPanel}>
              <p className={styles.panelLabel}>Your interpretation</p>
              <OrderBookAnswerOptions
                questionText={scenario.questionText}
                options={state.displayAnswerOptions}
                selectedAnswer={state.selectedAnswer}
                onSelect={(answer) => dispatch({ type: "SELECT_ANSWER", answer })}
              />
              <p id="order-book-submit-help" className={styles.submitHelp} aria-live="polite">
                {state.selectedAnswer
                  ? "Your selection is recorded. Submit when ready."
                  : "Select one interpretation to enable Submit Read."}
              </p>
              <button
                className={styles.primaryButton}
                type="button"
                disabled={!state.selectedAnswer}
                aria-describedby="order-book-submit-help"
                onClick={() => dispatch({ type: "SUBMIT", scenarioCount: orderBookScenarios.length })}
              >
                Submit Read
              </button>
            </aside>
          </div>
        </section>
      ) : null}
      {state.phase === "results" && state.resultSnapshot ? (
        <OrderBookResults
          snapshot={state.resultSnapshot}
          headingRef={resultsHeadingRef}
          onTryAnother={start}
        />
      ) : null}
    </OrderBookFrame>
  );
}
