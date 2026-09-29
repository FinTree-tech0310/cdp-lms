"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { MiniGameShell } from "@/components/mini-games/MiniGameShell";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { DefenseQuestionStage } from "./_components/DefenseQuestionStage";
import { ThesisDefenseIntro } from "./_components/ThesisDefenseIntro";
import { ThesisDefenseResult } from "./_components/ThesisDefenseResult";
import { ThesisReference } from "./_components/ThesisReference";
import { THESIS_DEFENSE_SCENARIOS } from "./_data/thesis-defense-scenarios";
import {
  markDefenseScenarioSeen,
  selectDefenseScenario,
} from "./_lib/select-defense-scenario";
import { shuffleDefenseOptionIds } from "./_lib/shuffle-defense-options";
import {
  INITIAL_THESIS_DEFENSE_STATE,
  THESIS_DEFENSE_STORAGE_KEY,
  THESIS_DEFENSE_STORAGE_VERSION,
  orderedDefenseQuestions,
  parseThesisDefensePersistence,
  thesisDefenseReducer,
} from "./_lib/thesis-defense-state";
import type { DefenseQuestionNumber } from "./_lib/thesis-defense-types";
import styles from "./thesis-defense.module.css";

export function ThesisDefense() {
  const [state, dispatch] = useReducer(
    thesisDefenseReducer,
    INITIAL_THESIS_DEFENSE_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const reactionHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(THESIS_DEFENSE_STORAGE_KEY);
      const saved = raw
        ? parseThesisDefensePersistence(JSON.parse(raw))
        : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Persistence is optional; rotation remains available in memory.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(
        THESIS_DEFENSE_STORAGE_KEY,
        JSON.stringify({
          version: THESIS_DEFENSE_STORAGE_VERSION,
          seenScenarioIds: state.seenScenarioIds,
        }),
      );
    } catch {
      // Persistence is optional; rotation remains available in memory.
    }
  }, [hasHydrated, state.seenScenarioIds]);

  useEffect(() => {
    const target =
      state.phase === "question"
        ? questionHeadingRef.current
        : state.phase === "reaction"
          ? reactionHeadingRef.current
          : state.phase === "result"
            ? resultHeadingRef.current
            : null;
    if (!target) return;
    const frame = window.requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state.currentQuestionNumber, state.phase, state.sessionKey]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "result" || !state.resultSnapshot) return;
    const { endingType, totalScore } = state.resultSnapshot;
    // totalScore spans -12..12 (four answers scored -3..3); map it to 0-100.
    const normalized = Math.max(
      0,
      Math.min(100, Math.round(((totalScore + 12) / 24) * 100)),
    );
    syncResult({
      score: normalized,
      outcome: endingType,
      completed: true,
    });
  }, [state.phase, state.resultSnapshot, syncResult]);

  const startSession = useCallback(() => {
    const scenario = selectDefenseScenario(
      THESIS_DEFENSE_SCENARIOS,
      state.seenScenarioIds,
    );
    const firstQuestion = orderedDefenseQuestions(scenario)[0];
    dispatch({
      type: "START",
      scenario,
      optionDisplayOrder: shuffleDefenseOptionIds(firstQuestion.options),
    });
  }, [state.seenScenarioIds]);

  useEntryEnterShortcut(
    hasHydrated && state.phase === "ready",
    startSession,
  );

  const scenario = state.activeScenario;
  const orderedQuestions = useMemo(
    () => (scenario ? orderedDefenseQuestions(scenario) : []),
    [scenario],
  );
  const currentQuestion =
    orderedQuestions.find(
      (question) => question.questionNumber === state.currentQuestionNumber,
    ) ?? null;
  const currentAnswer =
    state.answerHistory.find(
      (answer) => answer.questionNumber === state.currentQuestionNumber,
    ) ?? null;

  const orderedOptions = useMemo(() => {
    if (!currentQuestion || !state.currentOptionDisplayOrder) return [];
    const optionsById = new Map(
      currentQuestion.options.map((option) => [option.id, option]),
    );
    return state.currentOptionDisplayOrder.flatMap((optionId) => {
      const option = optionsById.get(optionId);
      return option ? [option] : [];
    });
  }, [currentQuestion, state.currentOptionDisplayOrder]);

  const selectAnswer = useCallback((selectedOptionId: string) => {
    dispatch({ type: "SELECT_ANSWER", selectedOptionId });
  }, []);

  const continueMeeting = useCallback(() => {
    if (!scenario || state.phase !== "reaction") return;
    const nextQuestionNumber = (state.currentQuestionNumber +
      1) as DefenseQuestionNumber;
    const nextQuestion = orderedDefenseQuestions(scenario).find(
      (question) => question.questionNumber === nextQuestionNumber,
    );
    if (!nextQuestion) return;
    dispatch({
      type: "CONTINUE",
      optionDisplayOrder: shuffleDefenseOptionIds(nextQuestion.options),
    });
  }, [scenario, state.currentQuestionNumber, state.phase]);

  const showFinalAssessment = useCallback(() => {
    if (!scenario || state.phase !== "reaction") return;
    dispatch({
      type: "SHOW_RESULT",
      seenScenarioIds: markDefenseScenarioSeen(
        THESIS_DEFENSE_SCENARIOS,
        state.seenScenarioIds,
        scenario.id,
      ),
    });
  }, [scenario, state.phase, state.seenScenarioIds]);

  const meetingPhase =
    state.phase === "question" || state.phase === "reaction"
      ? state.phase
      : null;

  return (
    <MiniGameShell
      gameLabel="Thesis Defense"
      hubHref="/mini-games/equity-research-games"
      backLabel="Equity Research Games"
      rightContent={
        meetingPhase ? (
          <p className={styles.shellStatus}>Investor meeting</p>
        ) : state.phase === "result" ? (
          <p className={styles.shellStatus}>PM assessment</p>
        ) : null
      }
    >
      {state.phase === "ready" ? (
        <ThesisDefenseIntro isReady={hasHydrated} onStart={startSession} />
      ) : null}

      {scenario && currentQuestion && meetingPhase ? (
        <div className={styles.meetingWorkspace}>
          <ThesisReference scenario={scenario} />
          <DefenseQuestionStage
            question={currentQuestion}
            questionNumber={state.currentQuestionNumber}
            orderedOptions={orderedOptions}
            selectedAnswer={currentAnswer}
            phase={meetingPhase}
            questionHeadingRef={questionHeadingRef}
            reactionHeadingRef={reactionHeadingRef}
            onSelect={selectAnswer}
            onContinue={continueMeeting}
            onSeeAssessment={showFinalAssessment}
          />
        </div>
      ) : null}

      {scenario && state.phase === "result" && state.resultSnapshot ? (
        <ThesisDefenseResult
          scenario={scenario}
          snapshot={state.resultSnapshot}
          headingRef={resultHeadingRef}
          onTryAnother={startSession}
        />
      ) : null}
    </MiniGameShell>
  );
}
