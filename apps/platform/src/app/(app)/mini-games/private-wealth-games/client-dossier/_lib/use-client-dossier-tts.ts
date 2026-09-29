"use client";

import {
  PRIVATE_WEALTH_DEFAULT_SPEECH_RATE,
  usePrivateWealthTts,
} from "../../_lib/use-private-wealth-tts";

interface ClientDossierTtsOptions {
  scopeKey: string;
}

interface ClientDossierTts {
  isSupported: boolean;
  isEnabled: boolean;
  isSpeaking: boolean;
  speechRate: number;
  enableAndSpeakClientQuote: (clientQuote: string) => boolean;
  speakClientQuote: (clientQuote: string) => boolean;
  changeSpeechRate: (speechRate: number, clientQuote: string) => boolean;
  disable: () => void;
  reset: () => void;
}

export const CLIENT_DOSSIER_DEFAULT_SPEECH_RATE =
  PRIVATE_WEALTH_DEFAULT_SPEECH_RATE;

export function useClientDossierTts({
  scopeKey,
}: ClientDossierTtsOptions): ClientDossierTts {
  const tts = usePrivateWealthTts({ scopeKey });

  return {
    isSupported: tts.isSupported,
    isEnabled: tts.isEnabled,
    isSpeaking: tts.isSpeaking,
    speechRate: tts.speechRate,
    enableAndSpeakClientQuote: tts.enableAndSpeak,
    speakClientQuote: tts.speak,
    changeSpeechRate: tts.changeSpeechRate,
    disable: tts.disable,
    reset: tts.reset,
  };
}
