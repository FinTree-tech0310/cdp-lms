"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import { VcPrimaryButton } from "@/app/(app)/mini-games/vc-games/_components/VcPrimaryButton";
import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { MiniGameShell } from "@/components/mini-games/MiniGameShell";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { PrivateWealthHubArt } from "../_components/PrivateWealthHubArt";
import { useClientDossierTts } from "../client-dossier/_lib/use-client-dossier-tts";
import { IncomingClientRequest } from "./_components/IncomingClientRequest";
import { PushBackReview } from "./_components/PushBackReview";
import { PUSH_BACK_SETS } from "./_data/push-back-sets";
import {
  INITIAL_PUSH_BACK_STATE,
  PUSH_BACK_STORAGE_KEY,
  PUSH_BACK_STORAGE_VERSION,
  parsePushBackPersistence,
  pushBackReducer,
  type PushBackDecision,
} from "./_lib/push-back-state";
import { selectPushBackSession } from "./_lib/select-push-back-set";
import styles from "./would-you-push-back.module.css";

const DECISION_TIME_MS = 5_000;
const DECISION_FEEDBACK_MS = 360;
const MESSAGE_ARRIVAL_MS = 180;

function getDecisionFromKey(
  key: string,
): Exclude<PushBackDecision, "skipped"> | undefined {
  const normalizedKey = key.toLowerCase();
  if (normalizedKey === "arrowleft" || normalizedKey === "a") {
    return "advise-against";
  }
  if (normalizedKey === "arrowup" || normalizedKey === "w") {
    return "follow";
  }
  if (normalizedKey === "arrowright" || normalizedKey === "d") {
    return "compromise";
  }
  return undefined;
}

function isEditableShortcutTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement
    || target instanceof HTMLSelectElement
    || target instanceof HTMLTextAreaElement
    || (target instanceof HTMLElement && target.isContentEditable)
  );
}

export function WouldYouPushBack() {
  const [state, dispatch] = useReducer(
    pushBackReducer,
    INITIAL_PUSH_BACK_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const activeRequestIdRef = useRef<string | null>(null);
  const decisionLockedRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const spokenScopeKeyRef = useRef<string | null>(null);
  const introPanelRef = useRef<HTMLElement>(null);

  const currentRequest = state.requests[state.activeIndex];
  const currentRequestId = currentRequest?.id ?? null;
  const currentMessage = currentRequest?.message ?? "";
  const isGameplayPhase =
    state.phase === "presenting" || state.phase === "playing";
  const ttsScopeKey =
    isGameplayPhase && currentRequestId
      ? [state.sessionKey, currentRequestId].join(":")
      : "inactive";
  const {
    changeSpeechRate,
    disable: disableTts,
    enableAndSpeakClientQuote,
    isEnabled: isTtsEnabled,
    isSpeaking,
    isSupported: isTtsSupported,
    reset: resetTts,
    speechRate,
    speakClientQuote,
  } = useClientDossierTts({ scopeKey: ttsScopeKey });

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(PUSH_BACK_STORAGE_KEY);
      const saved = raw ? parsePushBackPersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Storage is optional; the game remains playable without it.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(
        PUSH_BACK_STORAGE_KEY,
        JSON.stringify({
          version: PUSH_BACK_STORAGE_VERSION,
          seenSetIds: state.seenSetIds,
        }),
      );
    } catch {
      // Rotation falls back to in-memory history if storage is unavailable.
    }
  }, [hasHydrated, state.seenSetIds]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state.phase !== "ready") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    introPanelRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== "presenting") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const arrivalTimer = window.setTimeout(
      () => dispatch({ type: "ACTIVATE_REQUEST" }),
      prefersReducedMotion ? 0 : MESSAGE_ARRIVAL_MS,
    );

    return () => window.clearTimeout(arrivalTimer);
  }, [state.activeIndex, state.phase, state.sessionKey]);

  const resolveDecision = useCallback((decision: PushBackDecision) => {
    if (decisionLockedRef.current || !activeRequestIdRef.current) return;

    decisionLockedRef.current = true;
    dispatch({
      type: "RECORD_DECISION",
      requestId: activeRequestIdRef.current,
      decision,
    });
    advanceTimerRef.current = window.setTimeout(() => {
      decisionLockedRef.current = false;
      dispatch({ type: "ADVANCE" });
    }, DECISION_FEEDBACK_MS);
  }, []);

  useEffect(() => {
    if (
      state.phase !== "playing"
      || !currentRequestId
      || state.resolvingDecision !== null
    ) {
      return;
    }

    decisionLockedRef.current = false;
    activeRequestIdRef.current = currentRequestId;
    const decisionTimer = window.setTimeout(
      () => resolveDecision("skipped"),
      DECISION_TIME_MS,
    );

    return () => window.clearTimeout(decisionTimer);
  }, [
    currentRequestId,
    resolveDecision,
    state.phase,
    state.resolvingDecision,
  ]);

  useEffect(() => {
    if (
      state.phase !== "playing"
      || !currentRequestId
      || !isTtsEnabled
      || spokenScopeKeyRef.current === ttsScopeKey
    ) {
      return;
    }

    if (speakClientQuote(currentMessage)) {
      spokenScopeKeyRef.current = ttsScopeKey;
    }
  }, [
    currentMessage,
    currentRequestId,
    isTtsEnabled,
    speakClientQuote,
    state.phase,
    ttsScopeKey,
  ]);

  useEffect(() => {
    if (state.phase !== "playing" || state.resolvingDecision !== null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.altKey
        || event.ctrlKey
        || event.metaKey
        || event.repeat
        || isEditableShortcutTarget(event.target)
      ) {
        return;
      }

      const decision = getDecisionFromKey(event.key);
      if (!decision) return;

      event.preventDefault();
      resolveDecision(decision);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resolveDecision, state.phase, state.resolvingDecision]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results") return;
    const total = state.requests.length;
    const pushBacks = state.requests.filter(
      (request) => state.responses[request.id] === "advise-against",
    ).length;
    const follows = state.requests.filter(
      (request) => state.responses[request.id] === "follow",
    ).length;
    const compromises = state.requests.filter(
      (request) => state.responses[request.id] === "compromise",
    ).length;
    let outcome = "mixed-responses";
    if (pushBacks + follows + compromises === 0) {
      outcome = "all-skipped";
    } else if (pushBacks > follows && pushBacks > compromises) {
      outcome = "push-back-majority";
    } else if (follows > pushBacks && follows > compromises) {
      outcome = "follow-majority";
    } else if (compromises > pushBacks && compromises > follows) {
      outcome = "compromise-majority";
    }
    syncResult({
      score: total > 0 ? Math.round((pushBacks / total) * 100) : null,
      outcome,
      completed: true,
    });
  }, [state.phase, state.requests, state.responses, syncResult]);

  const startSession = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    decisionLockedRef.current = false;
    activeRequestIdRef.current = null;
    spokenScopeKeyRef.current = null;
    resetTts();
    const selection = selectPushBackSession(
      PUSH_BACK_SETS,
      state.seenSetIds,
    );
    dispatch({
      type: "START_SESSION",
      requests: selection.requests,
      seenSetIds: selection.seenSetIds,
    });
  }, [resetTts, state.seenSetIds]);

  const handleToggleTts = useCallback(() => {
    if (!currentRequestId || state.phase !== "playing") return;

    if (isTtsEnabled) {
      spokenScopeKeyRef.current = null;
      disableTts();
      return;
    }

    if (enableAndSpeakClientQuote(currentMessage)) {
      spokenScopeKeyRef.current = ttsScopeKey;
    }
  }, [
    currentMessage,
    currentRequestId,
    disableTts,
    enableAndSpeakClientQuote,
    isTtsEnabled,
    state.phase,
    ttsScopeKey,
  ]);

  const handleSpeechRateChange = useCallback(
    (nextSpeechRate: number) => {
      changeSpeechRate(nextSpeechRate, currentMessage);
    },
    [changeSpeechRate, currentMessage],
  );

  useEntryEnterShortcut(
    hasHydrated && state.phase === "ready",
    startSession,
  );

  return (
    <MiniGameShell
      gameLabel="Would You Push Back?"
      hubHref="/mini-games/private-wealth-games"
      backLabel="Private Wealth Games"
      rightContent={
        isGameplayPhase && currentRequest ? (
          <p className={styles.shellStatus}>Rapid client judgment</p>
        ) : null
      }
    >
      {state.phase === "ready" ? (
        <section
          ref={introPanelRef}
          className={styles.introPanel}
          aria-labelledby="push-back-title"
        >
          <PrivateWealthHubArt game="would-you-push-back" placement="entry" />
          <p className={styles.eyebrow}>Private Wealth</p>
          <h1 id="push-back-title">A client just messaged. What do you say?</h1>
          <p className={styles.introCopy}>
            Read each request, weigh the trade-off, and choose how you would respond.
          </p>
          <div className={styles.introDetails}>
            <p>One complete request set · 5 seconds each</p>
            <p>No score or streak — this is fast advisor judgment.</p>
          </div>
          <VcPrimaryButton
            beam
            disabled={!hasHydrated}
            className={styles.startButton}
            onClick={startSession}
          >
            {hasHydrated ? "Start Session" : "Preparing session"}
          </VcPrimaryButton>
        </section>
      ) : null}

      {isGameplayPhase && currentRequest ? (
        <IncomingClientRequest
          request={currentRequest}
          currentNumber={state.activeIndex + 1}
          totalRequests={state.requests.length}
          sessionKey={state.sessionKey}
          decisionTimeMs={DECISION_TIME_MS}
          isPresenting={state.phase === "presenting"}
          resolvingDecision={state.resolvingDecision}
          isTtsSupported={isTtsSupported}
          isTtsEnabled={isTtsEnabled}
          isSpeaking={isSpeaking}
          speechRate={speechRate}
          onToggleTts={handleToggleTts}
          onSpeechRateChange={handleSpeechRateChange}
          onChoose={resolveDecision}
        />
      ) : null}

      {state.phase === "results" ? (
        <section className={styles.resultsPanel} aria-labelledby="push-back-review-title">
          <p className={styles.eyebrow}>Session review</p>
          <h1 id="push-back-review-title">Fast requests still deserve context.</h1>
          <p className={styles.resultsIntro}>
            Review the responses you recorded alongside the advisor perspective for each request.
          </p>
          <PushBackReview requests={state.requests} responses={state.responses} />
          <VcPrimaryButton
            beam
            spacing="roomy"
            className={styles.playAgainButton}
            onClick={startSession}
          >
            Play Again
          </VcPrimaryButton>
        </section>
      ) : null}
    </MiniGameShell>
  );
}
