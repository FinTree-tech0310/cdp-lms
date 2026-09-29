"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

interface PrivateWealthTtsOptions {
  scopeKey: string;
}

interface PrivateWealthTts {
  isSupported: boolean;
  isEnabled: boolean;
  isSpeaking: boolean;
  speechRate: number;
  enableAndSpeak: (text: string) => boolean;
  speak: (text: string) => boolean;
  changeSpeechRate: (speechRate: number, text: string) => boolean;
  disable: () => void;
  reset: () => void;
}

export const PRIVATE_WEALTH_DEFAULT_SPEECH_RATE = 1.2;

function getSpeechSynthesis(): SpeechSynthesis | null {
  if (
    typeof window === "undefined"
    || !("speechSynthesis" in window)
    || !("SpeechSynthesisUtterance" in window)
  ) {
    return null;
  }

  return window.speechSynthesis;
}

function subscribeToSpeechSupport(): () => void {
  return () => undefined;
}

function getSpeechSupportSnapshot(): boolean {
  return getSpeechSynthesis() !== null;
}

function getServerSpeechSupportSnapshot(): boolean {
  return false;
}

export function usePrivateWealthTts({
  scopeKey,
}: PrivateWealthTtsOptions): PrivateWealthTts {
  const isSupported = useSyncExternalStore(
    subscribeToSpeechSupport,
    getSpeechSupportSnapshot,
    getServerSpeechSupportSnapshot,
  );
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(
    PRIVATE_WEALTH_DEFAULT_SPEECH_RATE,
  );
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const previousScopeKeyRef = useRef(scopeKey);
  const isMountedRef = useRef(false);

  const cancel = useCallback(() => {
    getSpeechSynthesis()?.cancel();
    currentUtteranceRef.current = null;
    if (isMountedRef.current) setIsSpeaking(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const speechSynthesis = getSpeechSynthesis();

    return () => {
      isMountedRef.current = false;
      speechSynthesis?.cancel();
      currentUtteranceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (previousScopeKeyRef.current === scopeKey) return;
    previousScopeKeyRef.current = scopeKey;
    cancel();
  }, [cancel, scopeKey]);

  const speakNow = useCallback(
    (text: string, rate = speechRate) => {
      const speechSynthesis = getSpeechSynthesis();
      const spokenText = text.trim();
      if (!speechSynthesis || spokenText.length === 0) return false;

      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = "en-IN";
      utterance.rate = rate;
      utterance.pitch = 1;

      const finish = () => {
        if (currentUtteranceRef.current !== utterance) return;
        currentUtteranceRef.current = null;
        if (isMountedRef.current) setIsSpeaking(false);
      };

      utterance.onend = finish;
      utterance.onerror = finish;
      currentUtteranceRef.current = utterance;
      setIsSpeaking(true);
      speechSynthesis.speak(utterance);
      return true;
    },
    [speechRate],
  );

  const enableAndSpeak = useCallback(
    (text: string) => {
      if (!isSupported) return false;
      setIsEnabled(true);
      return speakNow(text);
    },
    [isSupported, speakNow],
  );

  const speak = useCallback(
    (text: string) => {
      if (!isEnabled) return false;
      return speakNow(text);
    },
    [isEnabled, speakNow],
  );

  const changeSpeechRate = useCallback(
    (nextSpeechRate: number, text: string) => {
      setSpeechRate(nextSpeechRate);
      if (!isEnabled) return false;
      return speakNow(text, nextSpeechRate);
    },
    [isEnabled, speakNow],
  );

  const disable = useCallback(() => {
    setIsEnabled(false);
    cancel();
  }, [cancel]);

  const reset = useCallback(() => {
    setIsEnabled(false);
    setSpeechRate(PRIVATE_WEALTH_DEFAULT_SPEECH_RATE);
    cancel();
  }, [cancel]);

  return {
    isSupported,
    isEnabled,
    isSpeaking,
    speechRate,
    enableAndSpeak,
    speak,
    changeSpeechRate,
    disable,
    reset,
  };
}
