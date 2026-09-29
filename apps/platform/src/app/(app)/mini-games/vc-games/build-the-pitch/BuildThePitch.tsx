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
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";

import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { VcGameShell } from "../_components/VcGameShell";
import { VcPrimaryButton } from "../_components/VcPrimaryButton";
import { useEntryEnterShortcut } from "../_lib/use-entry-enter-shortcut";
import { MetricTilePool } from "./_components/MetricTilePool";
import { MetricsSlide } from "./_components/MetricsSlide";
import { VcFieldGuide } from "./_components/VcFieldGuide";
import { MATH_PUZZLE_SCENARIOS } from "./_data/math-puzzle-scenarios";
import {
  BUILD_PITCH_STORAGE_KEY,
  BUILD_PITCH_STORAGE_VERSION,
  INITIAL_BUILD_PITCH_STATE,
  buildPitchReducer,
  parseBuildPitchPersistence,
} from "./_lib/build-pitch-state";
import {
  selectScenarioWithinSection,
  selectSection,
  shuffleTiles,
} from "./_lib/select-scenario";
import styles from "./build-the-pitch.module.css";

gsap.registerPlugin(useGSAP);

const VERDICT_LABELS = {
  healthy: "Healthy",
  concerning: "Concerning",
  unsustainable: "Unsustainable",
} as const;

export function BuildThePitch() {
  const [state, dispatch] = useReducer(buildPitchReducer, INITIAL_BUILD_PITCH_STATE);
  const [activeTileId, setActiveTileId] = useState<string | null>(null);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLElement>(null);
  const tryAnotherRef = useRef<HTMLButtonElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(BUILD_PITCH_STORAGE_KEY);
      const saved = raw ? parseBuildPitchPersistence(JSON.parse(raw)) : null;
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
        BUILD_PITCH_STORAGE_KEY,
        JSON.stringify({
          version: BUILD_PITCH_STORAGE_VERSION,
          seenSectionIds: state.seenSectionIds,
          seenScenarioIdsBySection: state.seenScenarioIdsBySection,
          lastTileOrders: state.lastTileOrders,
        }),
      );
    } catch {
      // Persistence is optional; the game remains playable without it.
    }
  }, [
    hasHydrated,
    state.lastTileOrders,
    state.seenScenarioIdsBySection,
    state.seenSectionIds,
  ]);

  useEffect(() => {
    if (state.phase === "results") tryAnotherRef.current?.focus();
  }, [state.phase]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results" || !state.activeScenario) return;
    const { slots, verdictType } = state.activeScenario;
    const correct = slots.filter(
      (slot) => state.placements[slot.id] === slot.correctTileId,
    ).length;
    syncResult({
      score: slots.length > 0 ? Math.round((correct / slots.length) * 100) : null,
      outcome: verdictType,
      completed: true,
    });
  }, [state.phase, state.activeScenario, state.placements, syncResult]);

  const tilesById = useMemo(
    () => new Map(state.tileOrder.map((tile) => [tile.id, tile])),
    [state.tileOrder],
  );
  const placedTileIds = useMemo(() => new Set(Object.values(state.placements)), [state.placements]);
  const availableTiles = useMemo(
    () => state.tileOrder.filter((tile) => !placedTileIds.has(tile.id)),
    [placedTileIds, state.tileOrder],
  );

  const startScenario = useCallback(() => {
    const sectionSelection = selectSection(MATH_PUZZLE_SCENARIOS, state.seenSectionIds);
    const scenarioSelection = selectScenarioWithinSection(
      MATH_PUZZLE_SCENARIOS,
      sectionSelection.section,
      state.seenScenarioIdsBySection,
    );
    const scenario = scenarioSelection.scenario;
    const tileOrder = shuffleTiles(scenario.tilePool, state.lastTileOrders[scenario.id]);

    setActiveTileId(null);
    setSelectedTileId(null);
    dispatch({
      type: "START",
      scenario,
      tileOrder,
      seenSectionIds: sectionSelection.seenSectionIds,
      seenScenarioIdsBySection: scenarioSelection.seenScenarioIdsBySection,
    });
  }, [state.lastTileOrders, state.seenScenarioIdsBySection, state.seenSectionIds]);

  useEntryEnterShortcut(state.phase === "ready", startScenario);

  function handleDragStart(event: DragStartEvent) {
    const tileId = event.active.data.current?.tileId;
    setSelectedTileId(null);
    setActiveTileId(typeof tileId === "string" ? tileId : null);
  }

  function selectTile(tileId: string) {
    if (state.phase !== "playing") return;
    setSelectedTileId((currentTileId) => (currentTileId === tileId ? null : tileId));
  }

  function placeSelectedTile(slotId: string) {
    if (state.phase !== "playing" || !selectedTileId) return;
    dispatch({ type: "PLACE_TILE", tileId: selectedTileId, slotId });
    setSelectedTileId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTileId(null);
    if (state.phase !== "playing" || !event.over) return;

    const tileId = event.active.data.current?.tileId;
    if (typeof tileId !== "string") return;

    if (event.over.id === "tile-pool") {
      dispatch({ type: "REMOVE_TILE", tileId });
      return;
    }

    const slotId = event.over.data.current?.slotId;
    if (typeof slotId === "string") dispatch({ type: "PLACE_TILE", tileId, slotId });
  }

  const scenario = state.activeScenario;
  const allSlotsFilled = scenario
    ? scenario.slots.every((slot) => Boolean(state.placements[slot.id]))
    : false;
  const correctCount = scenario
    ? scenario.slots.filter((slot) => state.placements[slot.id] === slot.correctTileId).length
    : 0;
  const activeTile = activeTileId ? tilesById.get(activeTileId) : undefined;
  const selectedTile = selectedTileId ? tilesById.get(selectedTileId) : undefined;
  const submitted = state.phase === "results";

  useGSAP(
    () => {
      if (!scenario || !workspaceRef.current) return;

      const parts = gsap.utils.toArray<HTMLElement>(
        "[data-build-workspace-part]",
        workspaceRef.current,
      );
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set(parts, { autoAlpha: 1, x: 0, y: 0 });
        return;
      }

      gsap
        .timeline({ defaults: { duration: 0.28, ease: "power2.out" } })
        .fromTo(
          "[data-build-workspace-part='inputs']",
          { autoAlpha: 0, x: -10 },
          { autoAlpha: 1, x: 0 },
          0,
        )
        .fromTo(
          "[data-build-workspace-part='slide']",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0 },
          0.06,
        )
        .fromTo(
          "[data-build-workspace-part='pool']",
          { autoAlpha: 0, x: -8 },
          { autoAlpha: 1, x: 0 },
          0.12,
        )
        .fromTo(
          "[data-build-workspace-part='action']",
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0 },
          0.18,
        );
    },
    { dependencies: [scenario?.id], scope: workspaceRef, revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!submitted || !verdictRef.current) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const feedback = gsap.utils.toArray<HTMLElement>(
        "[data-build-result-detail]",
        verdictRef.current,
      );

      if (reducedMotion) {
        gsap.set([verdictRef.current, ...feedback], { autoAlpha: 1, x: 0, y: 0 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .fromTo(
          verdictRef.current,
          { autoAlpha: 0, x: -8 },
          { autoAlpha: 1, x: 0, duration: 0.24 },
        )
        .fromTo(
          feedback,
          { autoAlpha: 0, y: 5 },
          { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.035 },
          "-=0.12",
        );
    },
    { dependencies: [submitted], scope: verdictRef, revertOnUpdate: true },
  );

  return (
    <VcGameShell
      gameLabel="Build the Pitch"
      rightContent={<p className={styles.modeLabel}>No timer · drag and drop</p>}
    >
      <VcFieldGuide />
      {state.phase === "ready" ? (
        <section className={styles.introPanel} aria-labelledby="build-pitch-title">
          <div className={styles.introMotif} aria-hidden="true">
            <Image
              src="/images/vc-games/build-the-pitch.png"
              alt=""
              fill
              sizes="200px"
              priority
            />
          </div>
          <div className={styles.introContent}>
          <p className={styles.eyebrow}>Startup math</p>
          <h1 id="build-pitch-title">Build the metrics slide.</h1>
          <p className={styles.introCopy}>
            Read the raw inputs, then drag the right value into each VC-math slot. Take your
            time—the numbers matter more than speed.
          </p>
          <p className={styles.testNotice}>4 math sections · authored answers</p>
          <VcPrimaryButton beam spacing="roomy" onClick={startScenario}>
            Start
          </VcPrimaryButton>
          </div>
        </section>
      ) : null}

      {scenario && state.phase !== "ready" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragCancel={() => setActiveTileId(null)}
          onDragEnd={handleDragEnd}
        >
          <div ref={workspaceRef} className={styles.gameWorkspace} data-submitted={submitted}>
            <section
              className={styles.rawInputs}
              aria-labelledby="raw-inputs-title"
              data-build-workspace-part="inputs"
            >
              <div className={styles.inputHeading}>
                <div>
                  <p className={styles.sectionEyebrow}>Raw inputs</p>
                  <h1 id="raw-inputs-title">Company inputs</h1>
                </div>
                <span>Reference only</span>
              </div>
              <dl className={styles.inputGrid}>
                {scenario.rawInputs.map((input) => (
                  <div key={input.label}>
                    <dt>{input.label}</dt>
                    <dd>{input.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <MetricsSlide
              scenario={scenario}
              tilesById={tilesById}
              placements={state.placements}
              submitted={submitted}
              selectedTileId={selectedTileId}
              onSelectTile={selectTile}
              onPlaceSelected={placeSelectedTile}
              workspacePart="slide"
            />

            {!submitted ? (
              <MetricTilePool
                tiles={availableTiles}
                selectedTileId={selectedTileId}
                onSelectTile={selectTile}
                workspacePart="pool"
              />
            ) : null}

            {submitted ? (
              <section
                ref={verdictRef}
                className={`${styles.verdictPanel} ${styles[scenario.verdictType]}`}
                aria-labelledby="verdict-title"
                data-build-workspace-part="pool"
              >
                <p className={styles.sectionEyebrow} data-build-result-detail>
                  Investor verdict
                </p>
                <span
                  id="verdict-title"
                  className={styles.verdictTypeLabel}
                  data-build-result-detail
                >
                  {VERDICT_LABELS[scenario.verdictType]}
                </span>
                <p data-build-result-detail>{scenario.verdict}</p>
                <strong data-build-result-detail>{correctCount} of 3 metrics placed correctly</strong>
              </section>
            ) : null}

            <div className={styles.actionRow} data-build-workspace-part="action">
              {submitted ? (
                <VcPrimaryButton beam ref={tryAnotherRef} onClick={startScenario}>
                  Try Another
                </VcPrimaryButton>
              ) : (
                <VcPrimaryButton
                  disabled={!allSlotsFilled}
                  aria-describedby={!allSlotsFilled ? "submit-help" : undefined}
                  onClick={() => {
                    setSelectedTileId(null);
                    dispatch({ type: "SUBMIT" });
                  }}
                >
                  Submit Slide
                </VcPrimaryButton>
              )}
              {!submitted ? (
                <p id="submit-help" className={styles.submitHelp} aria-live="polite">
                  {selectedTile
                    ? `${selectedTile.label} selected. Click a metric slot to place it.`
                    : allSlotsFilled
                      ? "All three metrics placed. Ready to submit."
                      : "Drag a value, or click a value and then click its slot."}
                </p>
              ) : null}
            </div>
          </div>

          <DragOverlay>
            {activeTile ? <div className={styles.dragOverlay}>{activeTile.label}</div> : null}
          </DragOverlay>
        </DndContext>
      ) : null}
    </VcGameShell>
  );
}
