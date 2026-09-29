"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
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
import { BorderBeam } from "@/components/ui/border-beam";

import { AnalystReferencePanel } from "./_components/AnalystReferencePanel";
import { CompsCandidateCard } from "./_components/CompsCandidateCard";
import { CompsDropZone } from "./_components/CompsDropZone";
import { CompsScreenReview } from "./_components/CompsScreenReview";
import {
  compsScenarios,
  type CompsCandidate,
} from "./_data/comps-scenarios";
import {
  COMPS_SCREEN_STORAGE_KEY,
  COMPS_SCREEN_STORAGE_VERSION,
  INITIAL_COMPS_SCREEN_STATE,
  compsScreenReducer,
  parseCompsScreenPersistence,
  type CandidatePlacement,
} from "./_lib/comps-screen-state";
import {
  markCompsScenarioSeen,
  selectCompsScenario,
} from "./_lib/select-comps-scenario";
import { shuffleCompsCandidateIds } from "./_lib/shuffle-comps-candidates";
import { validateCompsScenarios } from "./_lib/validate-comps-scenarios";
import styles from "./the-comps-screen.module.css";

const PLACEMENT_NAMES: Record<CandidatePlacement, string> = {
  unscreened: "Unscreened Companies",
  include: "Include in Comp Set",
  exclude: "Exclude",
};

function orderedCandidates(
  order: readonly string[],
  candidates: readonly CompsCandidate[],
  placements: Record<string, CandidatePlacement>,
  placement: CandidatePlacement,
) {
  const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  return order.flatMap((candidateId) => {
    const candidate = candidateById.get(candidateId);
    return candidate && placements[candidateId] === placement ? [candidate] : [];
  });
}

export function TheCompsScreen() {
  const [state, dispatch] = useReducer(
    compsScreenReducer,
    INITIAL_COMPS_SCREEN_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const workspaceRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const pendingFocusCandidateId = useRef<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(COMPS_SCREEN_STORAGE_KEY);
      const saved = raw ? parseCompsScreenPersistence(JSON.parse(raw)) : null;
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
        COMPS_SCREEN_STORAGE_KEY,
        JSON.stringify({
          version: COMPS_SCREEN_STORAGE_VERSION,
          seenScenarioIds: state.seenScenarioIds,
          lastCandidateOrders: state.lastCandidateOrders,
        }),
      );
    } catch {
      // Rotation and shuffle history fall back to the in-memory session.
    }
  }, [hasHydrated, state.lastCandidateOrders, state.seenScenarioIds]);

  useEffect(() => {
    const candidateId = pendingFocusCandidateId.current;
    if (!candidateId) return;

    pendingFocusCandidateId.current = null;
    const focusTarget = Array.from(
      workspaceRef.current?.querySelectorAll<HTMLElement>("[data-candidate-focus]") ?? [],
    ).find((element) => element.dataset.candidateFocus === candidateId);
    focusTarget?.focus({ preventScroll: true });
  }, [state.placements]);

  useEffect(() => {
    if (state.phase === "results") {
      resultsRef.current?.focus({ preventScroll: true });
    }
  }, [state.phase]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results" || !state.activeScenario || !state.finalPlacements) return;
    const candidates = state.activeScenario.candidates;
    const finalPlacements = state.finalPlacements;
    const matched = candidates.filter(
      (candidate) =>
        finalPlacements[candidate.id] ===
        (candidate.shouldInclude ? "include" : "exclude"),
    ).length;
    syncResult({
      score: candidates.length > 0 ? Math.round((matched / candidates.length) * 100) : null,
      outcome: matched === candidates.length ? "all-matched" : "needs-another-look",
      completed: true,
    });
  }, [state.phase, state.activeScenario, state.finalPlacements, syncResult]);

  const startScenario = useCallback(() => {
    validateCompsScenarios(compsScenarios);
    const scenario = selectCompsScenario(
      compsScenarios,
      state.seenScenarioIds,
    );
    const candidateOrder = shuffleCompsCandidateIds(
      scenario.candidates,
      state.lastCandidateOrders[scenario.id],
    );

    setActiveCandidateId(null);
    setLiveMessage("");
    dispatch({ type: "START", scenario, candidateOrder });
  }, [state.lastCandidateOrders, state.seenScenarioIds]);

  useEntryEnterShortcut(
    hasHydrated && state.phase === "ready",
    startScenario,
  );

  const scenario = state.activeScenario;
  const candidateById = useMemo(
    () => new Map(scenario?.candidates.map((candidate) => [candidate.id, candidate]) ?? []),
    [scenario],
  );
  const activeCandidate = activeCandidateId
    ? candidateById.get(activeCandidateId) ?? null
    : null;
  const candidatesByPlacement = useMemo(() => {
    if (!scenario) {
      return { unscreened: [], include: [], exclude: [] } as Record<
        CandidatePlacement,
        CompsCandidate[]
      >;
    }

    return {
      unscreened: orderedCandidates(
        state.candidateOrder,
        scenario.candidates,
        state.placements,
        "unscreened",
      ),
      include: orderedCandidates(
        state.candidateOrder,
        scenario.candidates,
        state.placements,
        "include",
      ),
      exclude: orderedCandidates(
        state.candidateOrder,
        scenario.candidates,
        state.placements,
        "exclude",
      ),
    };
  }, [scenario, state.candidateOrder, state.placements]);

  const remainingCount = candidatesByPlacement.unscreened.length;

  const moveCandidate = useCallback((
    candidateId: string,
    placement: CandidatePlacement,
    restoreFocus: boolean,
  ) => {
    if (state.phase !== "screening") return;
    const candidate = candidateById.get(candidateId);
    if (!candidate || state.placements[candidateId] === placement) return;

    if (restoreFocus) pendingFocusCandidateId.current = candidateId;
    setLiveMessage(`${candidate.name} moved to ${PLACEMENT_NAMES[placement]}.`);
    dispatch({ type: "MOVE_CANDIDATE", candidateId, placement });
  }, [candidateById, state.phase, state.placements]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const candidateId = event.active.data.current?.candidateId;
    if (typeof candidateId === "string") setActiveCandidateId(candidateId);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveCandidateId(null);
    const candidateId = event.active.data.current?.candidateId;
    const placement = event.over?.data.current?.placement;
    if (
      typeof candidateId === "string"
      && (placement === "unscreened" || placement === "include" || placement === "exclude")
    ) {
      moveCandidate(candidateId, placement, false);
    }
  }, [moveCandidate]);

  const submitScreen = useCallback(() => {
    if (!scenario || state.phase !== "screening" || remainingCount !== 0) return;

    const seenScenarioIds = markCompsScenarioSeen(
      compsScenarios,
      state.seenScenarioIds,
      scenario.id,
    );
    setActiveCandidateId(null);
    setLiveMessage("");
    dispatch({ type: "SUBMIT", seenScenarioIds });
  }, [remainingCount, scenario, state.phase, state.seenScenarioIds]);

  const shellStatus = state.phase === "screening"
    ? `${remainingCount} awaiting decision`
    : state.phase === "results"
      ? "Analyst review"
      : null;

  return (
    <MiniGameShell
      gameLabel="The Comps Screen"
      hubHref="/mini-games/investment-banking-games"
      backLabel="Investment Banking Games"
      rightContent={shellStatus ? <p className={styles.shellStatus}>{shellStatus}</p> : null}
    >
      {state.phase === "ready" ? (
        <section className={styles.introPanel} aria-labelledby="comps-screen-title">
          <div className={styles.introWorksheet} aria-hidden="true">
            <div className={styles.worksheetHeader}>
              <span>Target</span>
              <i />
            </div>
            <div className={styles.worksheetRows}>
              <span /><span /><span />
            </div>
            <div className={styles.worksheetDecision}>
              <span>Include</span>
              <span>Exclude</span>
            </div>
          </div>
          <div className={styles.introContent}>
            <p className={styles.eyebrow}>Investment Banking · Comparable companies</p>
            <h1 id="comps-screen-title">Choose the right companies to value a business.</h1>
            <p className={styles.introCopy}>
              You are an analyst helping value a target company. Your job is to build a
              <strong> comp set</strong>: a group of similar public companies whose values can
              help estimate what the target may be worth.
            </p>
            <div className={styles.assignmentBrief}>
              <p className={styles.assignmentLabel}>Your assignment</p>
              <ol className={styles.introSteps}>
                <li>
                  <span>1</span>
                  <div>
                    <strong>Read the target and your senior&apos;s brief.</strong>
                    <p>The brief tells you which similarities matter most in this situation.</p>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div>
                    <strong>Screen every candidate.</strong>
                    <p>Place each company in Include or Exclude. There is no fixed split.</p>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <strong>Review the analyst reasoning.</strong>
                    <p>After Submit, see why every company belongs or does not belong.</p>
                  </div>
                </li>
              </ol>
            </div>
            <p className={styles.judgmentNote}>
              <strong>Watch for traps:</strong> a similar industry or revenue number alone does
              not make a company comparable. Apply the priorities in the brief.
            </p>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={!hasHydrated}
              onClick={startScenario}
            >
              <BorderBeam lightWidth={74} duration={4.2} borderWidth={2} />
              <span>{hasHydrated ? "Start Screening" : "Preparing screen"}</span>
            </button>
          </div>
        </section>
      ) : null}

      {scenario && state.phase === "screening" ? (
        <div ref={workspaceRef} className={styles.gameWorkspace}>
          <AnalystReferencePanel scenario={scenario} />

          <section className={styles.taskStrip} aria-labelledby="screening-task-title">
            <div>
              <p className={styles.eyebrow}>Your task</p>
              <h2 id="screening-task-title">
                Decide whether each company is a useful valuation peer.
              </h2>
            </div>
            <ol>
              <li><strong>Compare</strong> each profile with the target.</li>
              <li><strong>Apply</strong> the priorities in your senior&apos;s brief.</li>
              <li><strong>Place all {scenario.candidates.length}</strong> companies. There is no fixed Include/Exclude split.</li>
            </ol>
          </section>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            accessibility={{
              screenReaderInstructions: {
                draggable:
                  "To drag a company, press Space. Use the arrow keys to move it over a screening zone, then press Space again to drop. You can also use the assignment buttons on each company.",
              },
            }}
            onDragStart={handleDragStart}
            onDragCancel={() => setActiveCandidateId(null)}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.screeningBoard}>
              <CompsDropZone
                placement="unscreened"
                title="Unscreened Companies"
                instruction="Start here. Compare each profile with the target and brief."
                symbol="…"
                count={candidatesByPlacement.unscreened.length}
              >
                {candidatesByPlacement.unscreened.map((candidate) => (
                  <CompsCandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    placement="unscreened"
                    onMove={(candidateId, placement) =>
                      moveCandidate(candidateId, placement, true)
                    }
                  />
                ))}
              </CompsDropZone>

              <div className={styles.decisionZones}>
                <CompsDropZone
                  placement="include"
                  title="Include in Comp Set"
                  instruction="A useful valuation peer under the brief's priorities."
                  symbol="+"
                  count={candidatesByPlacement.include.length}
                >
                  {candidatesByPlacement.include.map((candidate) => (
                    <CompsCandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      placement="include"
                      onMove={(candidateId, placement) =>
                        moveCandidate(candidateId, placement, true)
                      }
                    />
                  ))}
                </CompsDropZone>

                <CompsDropZone
                  placement="exclude"
                  title="Exclude"
                  instruction="A major mismatch makes it a poor valuation peer."
                  symbol="−"
                  count={candidatesByPlacement.exclude.length}
                >
                  {candidatesByPlacement.exclude.map((candidate) => (
                    <CompsCandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      placement="exclude"
                      onMove={(candidateId, placement) =>
                        moveCandidate(candidateId, placement, true)
                      }
                    />
                  ))}
                </CompsDropZone>
              </div>
            </div>

            <DragOverlay dropAnimation={{ duration: 160, easing: "ease-out" }}>
              {activeCandidate ? (
                <div className={styles.dragOverlay}>
                  <span>Screening company</span>
                  <strong>{activeCandidate.name}</strong>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <div className={styles.submitArea}>
            <p id="remaining-companies" className={styles.remainingMessage} aria-live="polite">
              {remainingCount === 0
                ? "All companies have a decision. The comp screen is ready to submit."
                : `${remainingCount} ${remainingCount === 1 ? "company still needs" : "companies still need"} a decision.`}
            </p>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={remainingCount !== 0}
              aria-describedby="remaining-companies"
              onClick={submitScreen}
            >
              <span>Submit Comp Screen</span>
            </button>
          </div>
          <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
            {liveMessage}
          </p>
        </div>
      ) : null}

      {scenario && state.phase === "results" && state.finalPlacements ? (
        <div
          ref={resultsRef}
          className={styles.resultsWorkspace}
          tabIndex={-1}
          aria-labelledby="screen-review-title"
        >
          <AnalystReferencePanel scenario={scenario} />
          <CompsScreenReview
            scenario={scenario}
            candidateOrder={state.candidateOrder}
            finalPlacements={state.finalPlacements}
            onTryAnother={startScenario}
          />
        </div>
      ) : null}
    </MiniGameShell>
  );
}
