/**
 * Bridge between the dashboard's "Your tracks" (public.tracks, seeded in
 * migration 0002) and the careers pages (/careers?career=<id>).
 *
 * One id space for the dashboard, one for careers — this file is the only
 * place that knows they describe the same five paths.
 */

export const TRACK_TO_CAREER: Record<string, string> = {
  "track-equity": "equity-research",
  "track-ib": "investment-banking",
  "track-pe": "vc-private-equity",
  "track-pw": "private-wealth",
  "track-fof": "future-of-finance",
};

export const CAREER_TO_TRACK: Record<string, string> = Object.fromEntries(
  Object.entries(TRACK_TO_CAREER).map(([trackId, careerId]) => [
    careerId,
    trackId,
  ]),
);

/** Dashboard track id → career id (null when the track is unknown). */
export function careerIdForTrack(trackId: string): string | null {
  return TRACK_TO_CAREER[trackId] ?? null;
}

/** Deep link that opens one career's syllabus directly. */
export function careerHref(careerId: string): string {
  return `/careers?career=${encodeURIComponent(careerId)}`;
}

/**
 * The five career options as the careers page lists them (mirror of the
 * titles in components/careers/careers-board.tsx — duplicated rather than
 * imported so client pages don't pull the whole curriculum bundle). The
 * Expinars track filter offers exactly these.
 */
export const CAREER_TRACK_TITLES = [
  "Investment Banking",
  "Equity Research",
  "Private Wealth",
  "VC / Private Equity",
  "Future of Finance",
];
