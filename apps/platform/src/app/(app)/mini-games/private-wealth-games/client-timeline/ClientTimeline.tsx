"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useMemo,
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
import { ClientTimelineIntro } from "./_components/ClientTimelineIntro";
import { ClientTimelineRail } from "./_components/ClientTimelineRail";
import { TimelineEnding } from "./_components/TimelineEnding";
import { TimelineStoryStage } from "./_components/TimelineStoryStage";
import {
  CLIENT_TIMELINE_SCENARIOS,
  type TimelineStopOption,
} from "./_data/client-timeline-scenarios";
import {
  CLIENT_TIMELINE_STORAGE_KEY,
  CLIENT_TIMELINE_STORAGE_VERSION,
  INITIAL_CLIENT_TIMELINE_STATE,
  clientTimelineReducer,
  parseClientTimelinePersistence,
  selectTimelineEnding,
} from "./_lib/client-timeline-state";
import {
  completeClientTimelineScenario,
  selectClientTimelineScenario,
} from "./_lib/select-client-timeline-scenario";
import { shuffleTimelineOptionIds } from "./_lib/shuffle-timeline-options";
import { validateClientTimelineScenarios } from "./_lib/validate-client-timeline-scenario";
import styles from "./client-timeline.module.css";

gsap.registerPlugin(useGSAP);

function avatarPresentationFromSeed(
  seed: string,
): "feminine" | "masculine" {
  let hash = 0;
  for (const character of seed) {
    hash = Math.imul(hash, 31) + character.charCodeAt(0);
  }
  return (hash >>> 0) % 2 === 0 ? "feminine" : "masculine";
}

export function ClientTimeline() {
  const [state, dispatch] = useReducer(
    clientTimelineReducer,
    INITIAL_CLIENT_TIMELINE_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const introPanelRef = useRef<HTMLElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const lastAutoSpokenStopRef = useRef<string | null>(null);

  const scenario = state.activeScenario;
  const currentStop = scenario?.stops[state.currentStopIndex] ?? null;
  const currentChoice = currentStop
    ? state.choices.find((choice) => choice.stopId === currentStop.id) ?? null
    : null;
  const visualStopIndex =
    state.phase === "advancing" && state.pendingStopIndex !== null
      ? state.pendingStopIndex
      : state.currentStopIndex;
  const presentation = scenario
    ? avatarPresentationFromSeed(scenario.clientAvatarSeed)
    : "masculine";
  const ttsScopeKey =
    scenario && currentStop && state.phase === "stop-decision"
      ? `${state.sessionKey}:${scenario.id}:${currentStop.id}`
      : "inactive";
  const {
    changeSpeechRate,
    disable: disableTts,
    enableAndSpeak,
    isEnabled: isTtsEnabled,
    isSpeaking,
    isSupported: isTtsSupported,
    reset: resetTts,
    speak,
    speechRate,
  } = usePrivateWealthTts({ scopeKey: ttsScopeKey });

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(CLIENT_TIMELINE_STORAGE_KEY);
      const saved = raw
        ? parseClientTimelinePersistence(JSON.parse(raw))
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
        CLIENT_TIMELINE_STORAGE_KEY,
        JSON.stringify({
          version: CLIENT_TIMELINE_STORAGE_VERSION,
          seenScenarioIds: state.seenScenarioIds,
        }),
      );
    } catch {
      // Persistence is optional; rotation remains available in memory.
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
    if (!currentStop || state.phase !== "stop-decision") return;
    const stopSpeechKey = `${state.sessionKey}:${currentStop.id}`;
    if (lastAutoSpokenStopRef.current === stopSpeechKey) return;
    lastAutoSpokenStopRef.current = stopSpeechKey;
    speak(currentStop.storyBeat);
  }, [currentStop, speak, state.phase, state.sessionKey]);

  const startSession = useCallback(() => {
    validateClientTimelineScenarios(CLIENT_TIMELINE_SCENARIOS);
    resetTts();
    lastAutoSpokenStopRef.current = null;
    dispatch({
      type: "START",
      scenario: selectClientTimelineScenario(
        CLIENT_TIMELINE_SCENARIOS,
        state.seenScenarioIds,
      ),
    });
  }, [resetTts, state.seenScenarioIds]);

  useEntryEnterShortcut(
    hasHydrated && state.phase === "ready",
    startSession,
  );

  const beginTimeline = useCallback(() => {
    const firstStop = scenario?.stops[0];
    if (!firstStop) return;
    dispatch({
      type: "BEGIN_TIMELINE",
      stopId: firstStop.id,
      optionIds: shuffleTimelineOptionIds(firstStop.options),
    });
  }, [scenario]);

  const chooseOption = useCallback(
    (option: TimelineStopOption) => {
      if (!currentStop || state.phase !== "stop-decision") return;
      dispatch({
        type: "SELECT_OPTION",
        choice: {
          stopId: currentStop.id,
          optionId: option.id,
          optionLabel: option.label,
          approachTag: option.approachTag,
        },
      });
    },
    [currentStop, state.phase],
  );

  const continueTimeline = useCallback(() => {
    if (!scenario || state.phase !== "stop-consequence") return;
    if (state.currentStopIndex === scenario.stops.length - 1) {
      disableTts();
      dispatch({
        type: "SHOW_ENDING",
        seenScenarioIds: completeClientTimelineScenario(
          state.seenScenarioIds,
          scenario.id,
          CLIENT_TIMELINE_SCENARIOS.length,
        ),
      });
      return;
    }

    const nextStopIndex = state.currentStopIndex + 1;
    const nextStop = scenario.stops[nextStopIndex];
    dispatch({
      type: "BEGIN_ADVANCE",
      pendingStopIndex: nextStopIndex,
      stopId: nextStop.id,
      optionIds: shuffleTimelineOptionIds(nextStop.options),
    });
  }, [disableTts, scenario, state.currentStopIndex, state.phase, state.seenScenarioIds]);

  const handleToggleTts = useCallback(() => {
    if (!currentStop || state.phase !== "stop-decision") return;
    if (isTtsEnabled) {
      disableTts();
      return;
    }
    enableAndSpeak(currentStop.storyBeat);
  }, [currentStop, disableTts, enableAndSpeak, isTtsEnabled, state.phase]);

  const handleSpeechRateChange = useCallback(
    (nextRate: number) => {
      if (!currentStop) return;
      changeSpeechRate(nextRate, currentStop.storyBeat);
    },
    [changeSpeechRate, currentStop],
  );

  useGSAP(
    () => {
      if (!workspaceRef.current) return;
      const stage = workspaceRef.current.querySelector<HTMLElement>(
        "[data-timeline-stage]",
      );
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (state.phase === "resolving-choice") {
        if (reducedMotion) {
          dispatch({ type: "SHOW_CONSEQUENCE" });
          return;
        }
        const selected = workspaceRef.current.querySelector<HTMLElement>(
          '[data-selected="true"]',
        );
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .to(selected, { scale: 0.98, duration: 0.12 })
          .to(stage, { autoAlpha: 0, y: -5, duration: 0.17 }, "-=0.02")
          .call(() => dispatch({ type: "SHOW_CONSEQUENCE" }));
        return;
      }

      if (state.phase === "advancing" && state.pendingStopIndex !== null) {
        if (reducedMotion) {
          dispatch({ type: "COMPLETE_ADVANCE" });
          return;
        }
        const progress = workspaceRef.current.querySelector<HTMLElement>(
          "[data-timeline-progress]",
        );
        const nextMarker = workspaceRef.current.querySelector<HTMLElement>(
          `[data-timeline-marker="${state.pendingStopIndex}"]`,
        );
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .to(stage, { autoAlpha: 0, x: -12, duration: 0.18 })
          .fromTo(
            progress,
            { scaleX: state.currentStopIndex / 2 },
            {
              scaleX: state.pendingStopIndex / 2,
              duration: 0.34,
              ease: "power2.inOut",
            },
            "-=0.05",
          )
          .fromTo(
            nextMarker,
            { scale: 0.92 },
            { scale: 1, duration: 0.2 },
            "-=0.14",
          )
          .call(() => dispatch({ type: "COMPLETE_ADVANCE" }));
        return;
      }

      if (
        state.phase === "stop-decision"
        || state.phase === "stop-consequence"
      ) {
        if (reducedMotion) {
          gsap.set(stage, { autoAlpha: 1, x: 0, y: 0 });
        } else {
          gsap.fromTo(
            stage,
            { autoAlpha: 0, x: state.phase === "stop-decision" ? 14 : 0, y: 6 },
            { autoAlpha: 1, x: 0, y: 0, duration: 0.24, ease: "power2.out" },
          );
        }
        window.requestAnimationFrame(() => {
          workspaceRef.current
            ?.querySelector<HTMLElement>(
              state.phase === "stop-decision" ? "[data-stop-heading]" : "[data-timeline-stage] h1",
            )
            ?.focus({ preventScroll: true });
        });
      }

      if (state.phase === "ending") {
        const details = gsap.utils.toArray<HTMLElement>(
          "[data-ending-detail]",
          workspaceRef.current,
        );
        if (reducedMotion) {
          gsap.set(details, { autoAlpha: 1, y: 0 });
        } else {
          gsap.fromTo(
            details,
            { autoAlpha: 0, y: 8 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.26,
              stagger: 0.055,
              ease: "power2.out",
            },
          );
        }
        window.requestAnimationFrame(() => {
          workspaceRef.current
            ?.querySelector<HTMLElement>("#timeline-ending-title")
            ?.focus({ preventScroll: true });
        });
      }
    },
    {
      dependencies: [
        state.currentStopIndex,
        state.pendingStopIndex,
        state.phase,
      ],
      scope: workspaceRef,
      revertOnUpdate: true,
    },
  );

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "ending") return;
    const disciplined = state.choices.filter(
      (choice) => choice.approachTag === "disciplined",
    ).length;
    const total = state.choices.length;
    syncResult({
      score: total > 0 ? Math.round((disciplined / total) * 100) : null,
      outcome:
        disciplined >= 2
          ? "ending-mostly-disciplined"
          : "ending-mostly-reactive",
      completed: true,
    });
  }, [state.phase, state.choices, syncResult]);

  const orderedOptions = useMemo(() => {
    if (!currentStop) return [];
    const optionIds = state.displayedOptionIdsByStop[currentStop.id];
    if (!optionIds) return currentStop.options;
    const optionsById = new Map(
      currentStop.options.map((option) => [option.id, option]),
    );
    return optionIds.flatMap((id) => {
      const option = optionsById.get(id);
      return option ? [option] : [];
    });
  }, [currentStop, state.displayedOptionIdsByStop]);

  const isTimelinePhase =
    state.phase === "stop-decision"
    || state.phase === "resolving-choice"
    || state.phase === "stop-consequence"
    || state.phase === "advancing";

  return (
    <MiniGameShell
      gameLabel="Client Timeline"
      hubHref="/mini-games/private-wealth-games"
      backLabel="Private Wealth Games"
      rightContent={
        state.phase !== "ready"
          ? <p className={styles.shellStatus}>One client through time</p>
          : null
      }
    >
      {state.phase === "ready" ? (
        <section
          ref={introPanelRef}
          className={styles.gameIntroPanel}
          aria-labelledby="client-timeline-title"
        >
          <PrivateWealthHubArt game="client-timeline" placement="entry" />
          <p className={styles.sectionEyebrow}>Private Wealth</p>
          <h1 id="client-timeline-title">Advice changes as life changes.</h1>
          <p className={styles.gameIntroCopy}>
            Follow one client across three financial moments and see the pattern your decisions create.
          </p>
          <div className={styles.gameIntroDetails}>
            <p>One client · Three stops</p>
            <p>No timer and no free skipping.</p>
          </div>
          <VcPrimaryButton beam disabled={!hasHydrated} onClick={startSession}>
            {hasHydrated ? "Start" : "Preparing timeline"}
          </VcPrimaryButton>
        </section>
      ) : null}

      {scenario && state.phase === "client-intro" ? (
        <ClientTimelineIntro
          scenario={scenario}
          presentation={presentation}
          onBegin={beginTimeline}
        />
      ) : null}

      {scenario && currentStop && (isTimelinePhase || state.phase === "ending") ? (
        <div ref={workspaceRef} className={styles.timelineWorkspace}>
          {isTimelinePhase ? (
            <>
              <ClientTimelineRail
                stops={scenario.stops}
                currentIndex={visualStopIndex}
              />
              <TimelineStoryStage
                clientName={scenario.clientName}
                clientAvatarSeed={scenario.clientAvatarSeed}
                presentation={presentation}
                stop={currentStop}
                phase={state.phase}
                orderedOptions={orderedOptions}
                selectedChoice={currentChoice}
                isTtsSupported={isTtsSupported}
                isTtsEnabled={isTtsEnabled}
                isSpeaking={isSpeaking}
                speechRate={speechRate}
                onToggleTts={handleToggleTts}
                onSpeechRateChange={handleSpeechRateChange}
                onChoose={chooseOption}
                onContinue={continueTimeline}
                isLastStop={state.currentStopIndex === scenario.stops.length - 1}
              />
            </>
          ) : (
            <TimelineEnding
              scenario={scenario}
              choices={state.choices}
              endingSummary={selectTimelineEnding(scenario, state.choices)}
              presentation={presentation}
              onTryAnother={startSession}
            />
          )}
        </div>
      ) : null}
    </MiniGameShell>
  );
}
