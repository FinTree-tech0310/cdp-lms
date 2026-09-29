export type TaskStatus = "scheduled" | "waiting" | "inProgress" | "handled" | "missed" | "leftUnhandled";

export interface AllNighterTask { id: string; description: string; urgencyLabel: string; arrivesAtSecond: number; expiresAfterSeconds?: number; workDurationSeconds: number; reasoningNote: string; }
export interface AllNighterScenario { id: string; dealContextNote: string; sessionDurationSeconds: number; taskSchedule: readonly AllNighterTask[]; }
export interface TaskRuntime { taskId: string; status: TaskStatus; arrivedAt: number; expiresAt: number | null; startedAt: number | null; completedAt: number | null; }
export interface AllNighterEvent { type: "arrived" | "started" | "handled" | "missed" | "sessionEnded"; taskId?: string; at: number; }
export interface FinalTaskResult { task: AllNighterTask; status: "handled" | "missed" | "leftUnhandled"; startedAt: number | null; completedAt: number | null; }
export interface AllNighterFinalSnapshot { scenarioId: string; sessionDurationSeconds: number; results: readonly FinalTaskResult[]; }
