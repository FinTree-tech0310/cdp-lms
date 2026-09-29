"use client";
import type { RefObject } from "react";
import { formatRemaining } from "../_lib/all-nighter-engine";
import type { AllNighterScenario, TaskRuntime } from "../_lib/all-nighter-types";
import styles from "../the-all-nighter.module.css";
export function ActiveWorkPanel({ scenario, tasks, activeTaskId, now, headingRef }: { scenario: AllNighterScenario; tasks: Record<string, TaskRuntime>; activeTaskId: string | null; now: number; headingRef: RefObject<HTMLHeadingElement | null> }) { const active = activeTaskId ? scenario.taskSchedule.find((task) => task.id === activeTaskId) : null; const runtime = active ? tasks[active.id] : null; return <aside className={styles.activePanel} aria-labelledby="active-work"><p className={styles.eyebrow}>Currently working on</p>{active && runtime ? <><h2 id="active-work" tabIndex={-1} ref={headingRef}>{active.description}</h2><p>Time remaining</p><strong>{formatRemaining((runtime.completedAt ?? now) - now)}</strong></> : <><h2 id="active-work" tabIndex={-1} ref={headingRef}>Ready for the next request</h2><p>Choose an item from the live queue. Your next choice commits your time.</p></>}</aside>; }
