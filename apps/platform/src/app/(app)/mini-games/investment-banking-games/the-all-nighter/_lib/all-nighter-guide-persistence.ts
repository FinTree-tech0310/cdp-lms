export const ALL_NIGHTER_GUIDE_STORAGE_KEY = "cdp:investment-banking-games:the-all-nighter:guide:v1";
export const ALL_NIGHTER_GUIDE_STORAGE_VERSION = 1;
export function readAllNighterGuideSeen() { try { const value = JSON.parse(window.localStorage.getItem(ALL_NIGHTER_GUIDE_STORAGE_KEY) ?? "null") as { version?: number; seen?: boolean }; return value.version === ALL_NIGHTER_GUIDE_STORAGE_VERSION && value.seen === true; } catch { return false; } }
export function saveAllNighterGuideSeen() { try { window.localStorage.setItem(ALL_NIGHTER_GUIDE_STORAGE_KEY, JSON.stringify({ version: ALL_NIGHTER_GUIDE_STORAGE_VERSION, seen: true })); } catch {} }
