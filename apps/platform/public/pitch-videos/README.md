# Founder Interrogation video assets

Place Founder Interrogation pitch videos in this folder. Use browser-friendly MP4 files encoded with H.264 video; AAC audio is recommended when a production video includes sound.

Suggested filenames use the neutral pitch number, for example:

```text
pitch-07.mp4
thumbnails/pitch-07.jpg
```

Then add one object to `app/vc-games/founder-interrogation-dev/_data/founder-pitch-videos.ts`:

```ts
{
  id: "pitch-7",
  videoUrl: "/pitch-videos/pitch-07.mp4",
  thumbnailUrl: "/pitch-videos/thumbnails/pitch-07.jpg",
  realCompanyName: "...",
  outcome: "...",
}
```

The library renders directly from that array. Adding a file and data entry requires no component or routing changes.

## Playback contract

- Selecting a pitch requests native HTML5 autoplay and keeps standard play, pause, seek, replay, and volume controls available.
- Production videos should include their intended audio. The player does not force mute; browsers may therefore block autoplay until the learner presses Play.
- Pausing never exposes the investment decision. `Accept` and `Reject` become available only after the video reaches its natural end, is sought to its natural end, or the learner explicitly chooses `End Pitch & Decide`.
- Every selected pitch must show this exact pre-playback framing: **This is an original re-presentation of a real startup's idea, performed by our team — not the original founder.**

## Pre-reveal anonymity

Videos and thumbnails must not contain a real company name, real founder name, recognizable company logo, branded wordmark, trademark graphic, or identifying caption text. Performers must not imply that they are the original founder. Captions, titles, metadata intended for display, and thumbnail copy must remain anonymous. The plain-text company identity belongs only in `realCompanyName`, which is rendered after the learner decides.

## Installed pitch library

Five supplied MOV masters were converted to 1280x720 H.264/AAC MP4 with anonymous filenames. The MOV masters remain in the separate source folder and are excluded from Git. The public library maps `pitch-01` through `pitch-05` to Flipkart, Koo, LocalOye, PepperTap, and Zoomcar in that order. Matching anonymous JPEG thumbnails are in `thumbnails/`. The development-only `test-pitch.mp4` and its test data entry have been removed.

The reveal copy in `founder-pitch-videos.ts` is a factual draft for review. The source material used for those drafts is [Walmart's Flipkart announcement](https://corporate.walmart.com/news/2018/08/18/walmart-and-flipkart-announce-completion-of-walmart-investment-in-flipkart-indias-leading-marketplace-ecommerce-platform), [Koo's co-founder announcement](https://www.linkedin.com/posts/mayank-bidawatka-028b2a1_heres-the-final-update-from-aprameya-radhakrishna-activity-7214153721419563008-2k1W), [LocalOye founder's 2016 restructuring account](https://inc42.com/buzz/localoyes-restructuring/), [PepperTap founder's 2016 statement](https://yourstory.com/2016/04/peppertap-shutdown), [Zoomcar's 2023 listing announcement](https://investor-relations.zoomcar.com/zoomcar-the-worlds-largest-emerging-market-focused-car-sharing-platform-announces-completion-of-its-business-combination-with-innovative-international-acquisition-corporation-ioac-and-ant/), and [Nasdaq's 2026 delisting notice](https://ir.nasdaq.com/node/109286/pdf).

Before external publication, listen to each complete clip to confirm the spoken audio does not reveal the startup or founder identity before the decision. Sampled video frames and anonymous filenames do not establish audio anonymity.

## Paused handoff — 2026-09-19

Founder Interrogation is intentionally paused while the editor trims the opening company-name mentions from the five MOV masters. Continue other games without changing this library's mechanics or reveal flow. Do not deploy the current MP4 exports as finished production media.

When the edited clips arrive:

1. Confirm the editor removed every spoken company name, founder name, brand reference, logo, wordmark, identifying caption, and identifying metadata—not only the first sentence.
2. Keep the master-to-library order fixed: Flipkart, Koo, LocalOye, PepperTap, Zoomcar.
3. Re-export as `pitch-01.mp4` through `pitch-05.mp4`, using 1280x720 H.264/YUV420p video, AAC audio, and fast-start metadata. Replace the existing public MP4s rather than adding company-named files.
4. Regenerate the five anonymous thumbnails from frames that contain no identifying content.
5. Listen to every complete exported MP4 and inspect the beginning, middle, end, captions, thumbnails, and metadata for identity leaks.
6. Review and approve the factual draft `outcome` text in `founder-pitch-videos.ts`.
7. Verify all five library cards, full playback, End Pitch & Decide, natural-end decision gating, Accept/Reject locking, company reveal, Back to Videos, Watched persistence, keyboard focus, and reduced motion.
8. Run targeted ESLint, platform TypeScript, media decoding, and HTTP checks for both Founder Interrogation routes plus every MP4 and thumbnail.

The original source folder is intentionally Git-ignored. It is working media, not a deployable application asset.
