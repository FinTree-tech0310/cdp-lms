# Founder Interrogation video assets

These canonical MP4 files are tracked with Git LFS. Run `git lfs install` and `git lfs pull` after cloning, and ensure build checkouts fetch LFS media. The duplicate `updated pitches/` folder was removed after exact-copy verification; the source mapping below is historical.

The live manifest is `src/app/(app)/mini-games/vc-games/founder-interrogation-dev/_data/founder-pitch-videos.ts` relative to `apps/platform`. The public route is `/mini-games/vc-games/founder-interrogation`; the implementation folder is not a separate development route.

See [the verified update handoff](../../../../docs/mini-games/FOUNDER-VIDEO-UPDATE.md) for exact source filenames, media properties, historical reveal sources, tests and review limits.

## Current library

| ID | Video | Company revealed after decision |
| --- | --- | --- |
| pitch-1 | pitch-01.mp4 | Flipkart |
| pitch-2 | pitch-02.mp4 | Koo |
| pitch-3 | pitch-03.mp4 | LocalOye |
| pitch-4 | pitch-04.mp4 | PepperTap |
| pitch-5 | pitch-05.mp4 | GoZoomo |
| pitch-6 | pitch-06.mp4 | Nykaa |
| pitch-7 | pitch-07.mp4 | Zerodha |
| pitch-8 | pitch-08.mp4 | Stayzilla |

Every entry uses a matching `thumbnails/pitch-NN.jpg`. On 2026-09-30, the eight supplied files in `updated pitches/` were copied byte-for-byte to these neutral filenames. The sources remain intact. All are 1920x1080 H.264/AAC MP4; no conversion was needed. Existing thumbnails 01-05 remain; thumbnails 06-08 were extracted from the new recordings.

## Playback contract

- Selection requests unmuted native autoplay, which the browser may block until Play is pressed. Native controls remain available.
- Pause does not advance the game. Natural end, seek to the end, or **End Pitch & Decide** enables Accept/Reject.
- Replay does not clear already-enabled decisions. Returning to the library and reopening starts a fresh attempt.
- Accept/Reject reveals company and historical outcome, then records a watched badge. The result is context, not correctness scoring.
- All eight pitches remain manually selectable. There is no unseen-until-exhausted rotation.
- Only the selected video is mounted; the library displays thumbnails without preloading all MP4s.

## Content and identity

Production data consists of `id`, `videoUrl`, `thumbnailUrl`, `realCompanyName` and `outcome`. The current engine has no script, transcript or interrogation-question screen. User-provided new scripts/Q&A are preserved in the documentation source notes rather than exposed before the reveal.

Keep production filenames, titles and thumbnails anonymous. Video framing continues to explain that the pitch is a team re-presentation, not footage of the original founder. Do not expose company/founder identity in pre-decision captions or text.

The previous 2026-09-19 handoff concerned older MOV-derived exports and incorrectly identified pitch 5 as Zoomcar. These replacement files supersede those exports, and the user explicitly approved correcting pitch 5 to GoZoomo. This is not evidence that complete spoken-audio anonymity has been reviewed. Complete audio/content review remains unverified; decoding, sampled frames and anonymous paths do not prove it. No deployment was performed.
