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
import { usePrivateWealthTts } from "../_lib/use-private-wealth-tts";
import { ConnectedCall } from "./_components/ConnectedCall";
import { IncomingCall } from "./_components/IncomingCall";
import { PanicCallComparison } from "./_components/PanicCallComparison";
import { PanicCallOutcome } from "./_components/PanicCallOutcome";
import { PANIC_CALL_SCENARIOS } from "./_data/panic-call-scenarios";
import {
  INITIAL_PANIC_CALL_STATE,
  PANIC_CALL_STORAGE_KEY,
  PANIC_CALL_STORAGE_VERSION,
  panicCallReducer,
  parsePanicCallPersistence,
  type PanicCallPath,
} from "./_lib/panic-call-state";
import {
  completePanicCallScenario,
  selectPanicCallScenario,
} from "./_lib/select-panic-call-scenario";
import styles from "./panic-call.module.css";

const CALL_CONNECT_MS = 220;
const OUTCOME_TRANSITION_MS = 280;

function isEditableShortcutTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement
    || target instanceof HTMLSelectElement
    || target instanceof HTMLTextAreaElement
    || (target instanceof HTMLElement && target.isContentEditable)
  );
}

function incomingActionFromKey(key: string): "answer" | "decline" | null {
  const normalizedKey = key.toLowerCase();
  if (normalizedKey === "a" || normalizedKey === "arrowleft") return "answer";
  if (normalizedKey === "d" || normalizedKey === "arrowright") return "decline";
  return null;
}

function responsePathFromKey(
  key: string,
): Exclude<PanicCallPath, "decline"> | null {
  const normalizedKey = key.toLowerCase();
  if (normalizedKey === "a" || normalizedKey === "arrowleft") {
    return "hold-and-reassure";
  }
  if (normalizedKey === "w" || normalizedKey === "arrowup") {
    return "partial-rebalance";
  }
  if (normalizedKey === "d" || normalizedKey === "arrowright") {
    return "execute-sell";
  }
  return null;
}

const FEMININE_AVATAR_SEEDS = new Set([
  "client-diane-62",
  "client-yuki-31",
  "client-asha-57",
  "client-eleanor-66",
]);

function avatarPresentation(seed: string): "feminine" | "masculine" {
  return FEMININE_AVATAR_SEEDS.has(seed) ? "feminine" : "masculine";
}

function avatarAgeStats(seed: string): readonly string[] {
  const age = seed.match(/-(\d+)$/)?.[1];
  return age ? [`Age ${age}`] : [];
}

export function PanicCall() {
  const [state, dispatch] = useReducer(
    panicCallReducer,
    INITIAL_PANIC_CALL_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const introPanelRef = useRef<HTMLElement>(null);
  const outcomeHeadingRef = useRef<HTMLDivElement>(null);

  const scenario = state.activeScenario;
  const ttsScopeKey =
    state.phase === "connected" && scenario
      ? `${state.sessionKey}:${scenario.id}`
      : "inactive";
  const {
    changeSpeechRate,
    disable: disableTts,
    enableAndSpeak,
    isEnabled: isTtsEnabled,
    isSpeaking,
    isSupported: isTtsSupported,
    reset: resetTts,
    speechRate,
  } = usePrivateWealthTts({ scopeKey: ttsScopeKey });

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(PANIC_CALL_STORAGE_KEY);
      const saved = raw ? parsePanicCallPersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Persistence is optional; the game remains playable without it.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(
        PANIC_CALL_STORAGE_KEY,
        JSON.stringify({
          version: PANIC_CALL_STORAGE_VERSION,
          seenScenarioIds: state.seenScenarioIds,
        }),
      );
    } catch {
      // Rotation falls back to in-memory history when storage is unavailable.
    }
  }, [hasHydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (state.phase !== "ready") return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    introPanelRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== "connecting") return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setTimeout(
      () => dispatch({ type: "CONNECT" }),
      reducedMotion ? 0 : CALL_CONNECT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== "resolving") return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setTimeout(
      () => dispatch({ type: "SHOW_OUTCOME" }),
      reducedMotion ? 0 : OUTCOME_TRANSITION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "outcome" || state.phase === "comparison") {
      outcomeHeadingRef.current?.focus({ preventScroll: true });
    }
  }, [state.phase]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "outcome" || !state.selectedPath) return;
    syncResult({ outcome: state.selectedPath, completed: true });
  }, [state.phase, state.selectedPath, syncResult]);

  const startSession = useCallback(() => {
    resetTts();
    const nextScenario = selectPanicCallScenario(
      PANIC_CALL_SCENARIOS,
      state.seenScenarioIds,
    );
    dispatch({ type: "START", scenario: nextScenario });
  }, [resetTts, state.seenScenarioIds]);

  useEntryEnterShortcut(
    hasHydrated && state.phase === "ready",
    startSession,
  );

  const completePath = useCallback(
    (path: PanicCallPath) => {
      if (!scenario) return;
      disableTts();
      dispatch({
        type: "SELECT_PATH",
        path,
        seenScenarioIds: completePanicCallScenario(
          state.seenScenarioIds,
          scenario.id,
          PANIC_CALL_SCENARIOS.length,
        ),
      });
    },
    [disableTts, scenario, state.seenScenarioIds],
  );

  useEffect(() => {
    if (state.phase !== "incoming" && state.phase !== "connected") return;

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

      if (state.phase === "incoming") {
        const action = incomingActionFromKey(event.key);
        if (!action) return;
        event.preventDefault();
        if (action === "answer") dispatch({ type: "ANSWER" });
        else completePath("decline");
        return;
      }

      const path = responsePathFromKey(event.key);
      if (!path) return;
      event.preventDefault();
      completePath(path);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completePath, state.phase]);

  const handleToggleTts = useCallback(() => {
    if (!scenario || state.phase !== "connected") return;
    if (isTtsEnabled) {
      disableTts();
      return;
    }
    enableAndSpeak(scenario.panicMessage);
  }, [
    disableTts,
    enableAndSpeak,
    isTtsEnabled,
    scenario,
    state.phase,
  ]);

  const handleSpeechRateChange = useCallback(
    (nextRate: number) => {
      if (!scenario) return;
      changeSpeechRate(nextRate, scenario.panicMessage);
    },
    [changeSpeechRate, scenario],
  );

  const isCallPhase =
    state.phase === "incoming"
    || state.phase === "connecting"
    || state.phase === "connected"
    || state.phase === "resolving";

  return (
    <MiniGameShell
      gameLabel="Panic Call"
      hubHref="/mini-games/private-wealth-games"
      backLabel="Private Wealth Games"
      rightContent={
        isCallPhase ? <p className={styles.shellStatus}>Client under pressure</p> : null
      }
    >
      {state.phase === "ready" ? (
        <section
          ref={introPanelRef}
          className={styles.introPanel}
          aria-labelledby="panic-call-title"
        >
          <PrivateWealthHubArt game="panic-call" placement="entry" />
          <p className={styles.sectionEyebrow}>Private Wealth</p>
          <h1 id="panic-call-title">The market fell. Your client is calling.</h1>
          <p className={styles.introCopy}>
            Choose whether to answer, guide the conversation, and see how each path unfolds.
          </p>
          <div className={styles.introDetails}>
            <p>One complete client call</p>
            <p>No timer and no answer key.</p>
          </div>
          <VcPrimaryButton beam disabled={!hasHydrated} onClick={startSession}>
            {hasHydrated ? "Start Session" : "Preparing call"}
          </VcPrimaryButton>
        </section>
      ) : null}

      {scenario && (state.phase === "incoming" || state.phase === "connecting") ? (
        <IncomingCall
          scenario={scenario}
          presentation={avatarPresentation(scenario.clientAvatarSeed)}
          avatarStats={avatarAgeStats(scenario.clientAvatarSeed)}
          isConnecting={state.phase === "connecting"}
          onAnswer={() => dispatch({ type: "ANSWER" })}
          onDecline={completePath}
        />
      ) : null}

      {scenario
      && (state.phase === "connected"
        || (state.phase === "resolving" && state.selectedPath !== "decline")) ? (
        <ConnectedCall
          scenario={scenario}
          presentation={avatarPresentation(scenario.clientAvatarSeed)}
          avatarStats={avatarAgeStats(scenario.clientAvatarSeed)}
          isResolving={state.phase === "resolving"}
          isTtsSupported={isTtsSupported}
          isTtsEnabled={isTtsEnabled}
          isSpeaking={isSpeaking}
          speechRate={speechRate}
          onToggleTts={handleToggleTts}
          onSpeechRateChange={handleSpeechRateChange}
          onChoose={completePath}
        />
      ) : null}

      {scenario && state.phase === "resolving" && state.selectedPath === "decline" ? (
        <section className={styles.declineTransition} aria-live="polite">
          <p>Call declined</p>
        </section>
      ) : null}

      {scenario && state.phase === "outcome" && state.selectedPath ? (
        <div ref={outcomeHeadingRef} tabIndex={-1}>
          <PanicCallOutcome
            scenario={scenario}
            selectedPath={state.selectedPath}
            onSeeOtherPaths={() => dispatch({ type: "SHOW_OTHER_PATHS" })}
            onPlayAgain={startSession}
          />
        </div>
      ) : null}

      {scenario && state.phase === "comparison" && state.selectedPath ? (
        <div ref={outcomeHeadingRef} tabIndex={-1}>
          <PanicCallComparison
            scenario={scenario}
            selectedPath={state.selectedPath}
            onPlayAgain={startSession}
          />
        </div>
      ) : null}
    </MiniGameShell>
  );
}
