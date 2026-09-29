import type { AllNighterScenario } from "./all-nighter-types";
export const allNighterTestScenario: AllNighterScenario = { id: "test-1", dealContextNote: "TEST DATA — placeholder deal context only.", sessionDurationSeconds: 30, taskSchedule: [
  { id: "task-1", description: "TEST — Respond to MD's email about the model.", urgencyLabel: "MD is waiting", arrivesAtSecond: 0, expiresAfterSeconds: 10, workDurationSeconds: 6, reasoningNote: "TEST DATA — placeholder reasoning only." },
  { id: "task-2", description: "TEST — Upload a document to the data room.", urgencyLabel: "Due end of day", arrivesAtSecond: 5, expiresAfterSeconds: 20, workDurationSeconds: 7, reasoningNote: "TEST DATA — placeholder reasoning only." },
  { id: "task-3", description: "TEST — File an expense report.", urgencyLabel: "No rush", arrivesAtSecond: 10, workDurationSeconds: 4, reasoningNote: "TEST DATA — placeholder reasoning only." },
] };
