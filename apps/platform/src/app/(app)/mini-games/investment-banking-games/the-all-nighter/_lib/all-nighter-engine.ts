import type { AllNighterEvent, AllNighterFinalSnapshot, AllNighterScenario, TaskRuntime } from "./all-nighter-types";
export interface Reconciliation { tasks: Record<string, TaskRuntime>; activeTaskId: string | null; events: AllNighterEvent[]; ended: boolean; sessionEndAt: number; }

export function initializeTasks(scenario: AllNighterScenario, startedAt: number): Record<string, TaskRuntime> {
  return Object.fromEntries(scenario.taskSchedule.map((task) => {
    const arrivedAt = startedAt + task.arrivesAtSecond * 1000;
    return [task.id, { taskId: task.id, status: "scheduled", arrivedAt, expiresAt: task.expiresAfterSeconds == null ? null : arrivedAt + task.expiresAfterSeconds * 1000, startedAt: null, completedAt: null }];
  }));
}

function endSession(scenario: AllNighterScenario, tasks: Record<string, TaskRuntime>, now: number) {
  const next = { ...tasks };
  for (const task of scenario.taskSchedule) {
    const runtime = next[task.id];
    if (runtime.arrivedAt >= now || runtime.status === "handled" || runtime.status === "missed") continue;
    if (runtime.status === "inProgress" && runtime.completedAt != null && runtime.completedAt < now) {
      next[task.id] = { ...runtime, status: "handled" };
    } else if (runtime.status !== "inProgress" && runtime.expiresAt != null && runtime.expiresAt < now) {
      next[task.id] = { ...runtime, status: "missed" };
    } else {
      next[task.id] = { ...runtime, status: "leftUnhandled" };
    }
  }
  return next;
}

export function reconcile(scenario: AllNighterScenario, tasks: Record<string, TaskRuntime>, activeTaskId: string | null, now: number): Reconciliation {
  const sessionEndAt = Object.values(tasks)[0] ? Math.min(...Object.values(tasks).map((task) => task.arrivedAt - scenario.taskSchedule.find((item) => item.id === task.taskId)!.arrivesAtSecond * 1000)) + scenario.sessionDurationSeconds * 1000 : now;
  const events: AllNighterEvent[] = [];
  if (now >= sessionEndAt) return { tasks: endSession(scenario, tasks, sessionEndAt), activeTaskId: null, events: [{ type: "sessionEnded", at: sessionEndAt }], ended: true, sessionEndAt };
  const next = { ...tasks }; let active = activeTaskId;
  if (active) {
    const running = next[active];
    if (running.completedAt != null && running.completedAt < sessionEndAt && now >= running.completedAt) { next[active] = { ...running, status: "handled" }; events.push({ type: "handled", taskId: active, at: running.completedAt }); active = null; }
  }
  for (const authored of scenario.taskSchedule) {
    const runtime = next[authored.id];
    if (runtime.status === "waiting" && runtime.expiresAt != null && now >= runtime.expiresAt) { next[authored.id] = { ...runtime, status: "missed" }; events.push({ type: "missed", taskId: authored.id, at: runtime.expiresAt }); }
  }
  for (const authored of scenario.taskSchedule) {
    const runtime = next[authored.id];
    if (runtime.status !== "scheduled" || now < runtime.arrivedAt) continue;
    if (runtime.expiresAt != null && now >= runtime.expiresAt) { next[authored.id] = { ...runtime, status: "missed" }; events.push({ type: "missed", taskId: authored.id, at: runtime.expiresAt }); }
    else { next[authored.id] = { ...runtime, status: "waiting" }; events.push({ type: "arrived", taskId: authored.id, at: runtime.arrivedAt }); }
  }
  return { tasks: next, activeTaskId: active, events, ended: false, sessionEndAt };
}

export function startTask(scenario: AllNighterScenario, tasks: Record<string, TaskRuntime>, activeTaskId: string | null, taskId: string, now: number): Reconciliation {
  const reconciled = reconcile(scenario, tasks, activeTaskId, now);
  if (reconciled.ended || reconciled.activeTaskId || reconciled.tasks[taskId]?.status !== "waiting") return reconciled;
  const authored = scenario.taskSchedule.find((task) => task.id === taskId)!;
  const runtime = reconciled.tasks[taskId];
  if (runtime.expiresAt != null && now >= runtime.expiresAt) return reconciled;
  return { ...reconciled, tasks: { ...reconciled.tasks, [taskId]: { ...runtime, status: "inProgress", startedAt: now, completedAt: now + authored.workDurationSeconds * 1000 } }, activeTaskId: taskId, events: [...reconciled.events, { type: "started", taskId, at: now }] };
}

export function createFinalSnapshot(scenario: AllNighterScenario, tasks: Record<string, TaskRuntime>): AllNighterFinalSnapshot {
  const results = scenario.taskSchedule.flatMap((task) => { const runtime = tasks[task.id]; return runtime.status === "scheduled" ? [] : [{ task, status: runtime.status as "handled" | "missed" | "leftUnhandled", startedAt: runtime.startedAt, completedAt: runtime.completedAt }]; });
  return Object.freeze({ scenarioId: scenario.id, sessionDurationSeconds: scenario.sessionDurationSeconds, results: Object.freeze(results.map((result) => Object.freeze({ ...result }))) });
}

export function formatRemaining(milliseconds: number) { const seconds = Math.max(0, Math.ceil(milliseconds / 1000)); return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }
