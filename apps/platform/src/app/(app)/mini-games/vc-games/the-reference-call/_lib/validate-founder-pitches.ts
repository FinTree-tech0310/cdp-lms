import type { FounderPitchTranscript } from "../_data/founder-pitch-transcripts";

export interface FounderPitchValidationIssue {
  transcriptId: string;
  message: string;
}

export function validateFounderPitchTranscripts(
  transcripts: readonly FounderPitchTranscript[],
): FounderPitchValidationIssue[] {
  const issues: FounderPitchValidationIssue[] = [];
  const transcriptIds = new Set<string>();

  for (const transcript of transcripts) {
    if (transcriptIds.has(transcript.id)) {
      issues.push({ transcriptId: transcript.id, message: "Transcript ID is duplicated." });
    }
    transcriptIds.add(transcript.id);
    if (!transcript.startupContext.trim()) issues.push({ transcriptId: transcript.id, message: "startupContext is required." });
    if (!transcript.diligenceFocus.trim()) issues.push({ transcriptId: transcript.id, message: "diligenceFocus is required." });
    if (transcript.lines.length < 14 || transcript.lines.length > 18) {
      issues.push({ transcriptId: transcript.id, message: "Production pitches must contain 14–18 lines." });
    }

    const lineIds = new Set<string>();
    for (const line of transcript.lines) {
      if (lineIds.has(line.id)) issues.push({ transcriptId: transcript.id, message: `Line ID ${line.id} is duplicated.` });
      lineIds.add(line.id);
      if (line.speaker !== "Founder" && line.signalType !== "neutral") {
        issues.push({ transcriptId: transcript.id, message: `Context line ${line.id} must be neutral.` });
      }
      if (line.signalType !== "neutral" && !line.whyItMatters?.trim()) {
        issues.push({ transcriptId: transcript.id, message: `Signal line ${line.id} requires whyItMatters.` });
      }
    }
  }

  return issues;
}
