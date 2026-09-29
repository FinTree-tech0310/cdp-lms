"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import { MiniGameShell } from "@/components/mini-games/MiniGameShell";
import { VcPrimaryButton } from "@/app/(app)/mini-games/vc-games/_components/VcPrimaryButton";
import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { PrivateWealthHubArt } from "../_components/PrivateWealthHubArt";
import { DossierCard } from "./_components/DossierCard";
import { DossierReview } from "./_components/DossierReview";
import { CLIENT_DOSSIER_SETS } from "./_data/client-dossiers";
import {
  CLIENT_DOSSIER_STORAGE_KEY,
  CLIENT_DOSSIER_STORAGE_VERSION,
  INITIAL_CLIENT_DOSSIER_STATE,
  clientDossierReducer,
  parseClientDossierPersistence,
  type ClientDossierDecision,
} from "./_lib/client-dossier-state";
import { selectSessionDossiers } from "./_lib/select-session-dossiers";
import { useClientDossierTts } from "./_lib/use-client-dossier-tts";
import styles from "./client-dossier.module.css";

const DECISION_TIME_MS = 8_000;
const DECISION_FEEDBACK_MS = 360;

function getDecisionFromKey(
  key: string,
): Exclude<ClientDossierDecision, "skipped"> | undefined {
  const normalizedKey = key.toLowerCase();
  if (normalizedKey === "arrowleft" || normalizedKey === "a") return "honor";
  if (normalizedKey === "arrowright" || normalizedKey === "d") {
    return "push-back";
  }
  return undefined;
}

export function ClientDossier() {
  const [state, dispatch] = useReducer(
    clientDossierReducer,
    INITIAL_CLIENT_DOSSIER_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const activeDossierIdRef = useRef<string | null>(null);
  const decisionLockedRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const spokenScopeKeyRef = useRef<string | null>(null);
  const introPanelRef = useRef<HTMLElement>(null);

  const currentDossier = state.dossiers[state.activeIndex];
  const currentDossierId = currentDossier?.id ?? null;
  const currentDossierQuote = currentDossier?.clientQuote ?? "";
  const ttsScopeKey =
    state.phase === "playing" && currentDossierId
      ? [state.sessionKey, currentDossierId].join(":")
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
      const raw = window.localStorage.getItem(CLIENT_DOSSIER_STORAGE_KEY);
      const saved = raw ? parseClientDossierPersistence(JSON.parse(raw)) : null;
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
        CLIENT_DOSSIER_STORAGE_KEY,
        JSON.stringify({
          version: CLIENT_DOSSIER_STORAGE_VERSION,
          seenSetIds: state.seenSetIds,
        }),
      );
    } catch {
      // Storage is optional; rotation falls back to the in-memory history.
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

  const resolveDecision = useCallback((decision: ClientDossierDecision) => {
    if (decisionLockedRef.current || !activeDossierIdRef.current) return;

    decisionLockedRef.current = true;
    dispatch({
      type: "RECORD_DECISION",
      dossierId: activeDossierIdRef.current,
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
      || !currentDossierId
      || state.resolvingDecision !== null
    ) {
      return;
    }

    decisionLockedRef.current = false;
    activeDossierIdRef.current = currentDossierId;
    const decisionTimer = window.setTimeout(
      () => resolveDecision("skipped"),
      DECISION_TIME_MS,
    );

    return () => window.clearTimeout(decisionTimer);
  }, [
    currentDossierId,
    resolveDecision,
    state.phase,
    state.resolvingDecision,
  ]);

  useEffect(() => {
    if (
      state.phase !== "playing"
      || !currentDossierId
      || !isTtsEnabled
      || spokenScopeKeyRef.current === ttsScopeKey
    ) {
      return;
    }

    if (speakClientQuote(currentDossierQuote)) {
      spokenScopeKeyRef.current = ttsScopeKey;
    }
  }, [
    currentDossierId,
    currentDossierQuote,
    isTtsEnabled,
    speakClientQuote,
    state.phase,
    ttsScopeKey,
  ]);

  useEffect(() => {
    if (state.phase !== "playing" || state.resolvingDecision !== null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;

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
    const total = state.dossiers.length;
    const pushBacks = state.dossiers.filter(
      (dossier) => state.responses[dossier.id] === "push-back",
    ).length;
    const honors = state.dossiers.filter(
      (dossier) => state.responses[dossier.id] === "honor",
    ).length;
    let outcome = "even-split";
    if (pushBacks + honors === 0) {
      outcome = "all-skipped";
    } else if (pushBacks > honors) {
      outcome = "push-back-majority";
    } else if (honors > pushBacks) {
      outcome = "honor-majority";
    }
    syncResult({
      score: total > 0 ? Math.round((pushBacks / total) * 100) : null,
      outcome,
      completed: true,
    });
  }, [state.phase, state.dossiers, state.responses, syncResult]);

  const startSession = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    decisionLockedRef.current = false;
    spokenScopeKeyRef.current = null;
    resetTts();
    const selection = selectSessionDossiers(
      CLIENT_DOSSIER_SETS,
      state.seenSetIds,
    );
    dispatch({
      type: "START_SESSION",
      dossiers: selection.dossiers,
      seenSetIds: selection.seenSetIds,
    });
  }, [resetTts, state.seenSetIds]);

  const handleToggleTts = useCallback(() => {
    if (!currentDossierId) return;

    if (isTtsEnabled) {
      spokenScopeKeyRef.current = null;
      disableTts();
      return;
    }

    if (enableAndSpeakClientQuote(currentDossierQuote)) {
      spokenScopeKeyRef.current = ttsScopeKey;
    }
  }, [
    currentDossierId,
    currentDossierQuote,
    disableTts,
    enableAndSpeakClientQuote,
    isTtsEnabled,
    ttsScopeKey,
  ]);

  const handleSpeechRateChange = useCallback(
    (nextSpeechRate: number) => {
      changeSpeechRate(nextSpeechRate, currentDossierQuote);
    },
    [changeSpeechRate, currentDossierQuote],
  );

  useEntryEnterShortcut(
    hasHydrated && state.phase === "ready",
    startSession,
  );

  return (
    <MiniGameShell
      gameLabel="Client Dossier"
      hubHref="/mini-games/private-wealth-games"
      backLabel="Private Wealth Games"
      rightContent={
        state.phase === "playing" && currentDossier ? (
          <p className={styles.shellStatus}>Client context first</p>
        ) : null
      }
    >
      {state.phase === "ready" ? (
        <section
          ref={introPanelRef}
          className={styles.introPanel}
          aria-labelledby="client-dossier-title"
        >
          <PrivateWealthHubArt game="client-dossier" placement="entry" />
          <p className={styles.eyebrow}>Private Wealth</p>
          <h1 id="client-dossier-title">Read the life behind the request.</h1>
          <p className={styles.introCopy}>
            Review a client’s stated preference alongside the context that gives it meaning.
          </p>
          <div className={styles.introDetails}>
            <p>6 dossiers · 8 seconds each</p>
            <p>No perfect answer — this is about client judgment.</p>
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

      {state.phase === "playing" && currentDossier ? (
        <DossierCard
          dossier={currentDossier}
          currentNumber={state.activeIndex + 1}
          totalDossiers={state.dossiers.length}
          sessionKey={state.sessionKey}
          decisionTimeMs={DECISION_TIME_MS}
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
        <section className={styles.resultsPanel} aria-labelledby="dossier-review-title">
          <p className={styles.eyebrow}>Session review</p>
          <h1 id="dossier-review-title">Every request needs its context.</h1>
          <p className={styles.resultsIntro}>
            Review the choices you recorded alongside the advisor perspective for each dossier.
          </p>
          <DossierReview dossiers={state.dossiers} responses={state.responses} />
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
