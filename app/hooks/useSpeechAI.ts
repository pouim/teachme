import { useState, useEffect, useCallback } from "react";

type UseSpeechAI = {
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;
};

const useSpeechAI = (): UseSpeechAI => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [speechSynthesis, setSpeechSynthesis] =
    useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        setRecognition(recognitionInstance);
      }

      if (window.speechSynthesis) {
        setSpeechSynthesis(window.speechSynthesis);
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognition) {
      setError("SpeechRecognition is not supported by your browser.");
      return;
    }

    setIsListening(true);
    setTranscript("");
    setError(null);

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const { transcript } = event.results[0][0];
      setTranscript((prevTranscript) => prevTranscript + " " + transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const speak = useCallback(
    (text: string) => {
      if (!speechSynthesis) {
        setError("SpeechSynthesis is not supported by your browser.");
        return;
      }

      const voices = speechSynthesis.getVoices();

      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Google") ||
          voice.name.includes("Microsoft") ||
          voice.default
      );

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        setError(`Speech synthesis error: ${event.error}`);
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    },
    [speechSynthesis]
  );

  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [recognition, speechSynthesis]);

  return {
    startListening,
    stopListening,
    speak,
    isListening,
    isSpeaking,
    transcript,
    error,
  };
};

export default useSpeechAI;
