import type { ReferenceCallTranscript } from "../_data/reference-call-transcripts";

export interface TranscriptValidationIssue {
  transcriptId: string;
  message: string;
}

export function validateReferenceCallTranscripts(
  transcripts: readonly ReferenceCallTranscript[],
): TranscriptValidationIssue[] {
  const issues: TranscriptValidationIssue[] = [];
  const transcriptIds = new Set<string>();

  for (const transcript of transcripts) {
    if (transcriptIds.has(transcript.id)) {
      issues.push({ transcriptId: transcript.id, message: "Transcript ID is duplicated." });
    }
    transcriptIds.add(transcript.id);

    if (!transcript.referenceContext.trim()) {
      issues.push({ transcriptId: transcript.id, message: "referenceContext is required." });
    }
    if (!transcript.diligenceFocus.trim()) {
      issues.push({ transcriptId: transcript.id, message: "diligenceFocus is required." });
    }

    if (transcript.lines.length < 14 || transcript.lines.length > 18) {
      issues.push({
        transcriptId: transcript.id,
        message: "Production transcripts must contain 14–18 lines.",
      });
    }

    const lineIds = new Set<string>();
    for (const line of transcript.lines) {
      if (lineIds.has(line.id)) {
        issues.push({ transcriptId: transcript.id, message: `Line ID ${line.id} is duplicated.` });
      }
      lineIds.add(line.id);

      if (line.isRedFlag && !line.whyItMatters?.trim()) {
        issues.push({
          transcriptId: transcript.id,
          message: `Red-flag line ${line.id} requires whyItMatters.`,
        });
      }
    }
  }

  return issues;
}
