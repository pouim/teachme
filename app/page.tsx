"use client";

import { useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { FiMic, FiMicOff } from "react-icons/fi";
import useSpeechAI from "./hooks/useSpeechAI";

export default function Home() {
  const {
    startListening,
    stopListening,
    speak,
    isListening,
    isSpeaking,
    transcript,
    error,
  } = useSpeechAI();

  useEffect(() => {
    if (transcript) {
      speak(`You said: ${transcript}. I will now explain React to you.`);
    }
  }, [transcript, speak]);

  return (
    <VStack spacing={8} p={8}>
      <Heading>AI Tutor Voice Interaction</Heading>

      <IconButton
        aria-label={isListening ? "Stop Listening" : "Start Listening"}
        icon={isListening ? <FiMicOff /> : <FiMic />}
        colorScheme={isListening ? "red" : "teal"}
        onClick={isListening ? stopListening : startListening}
        size="lg"
        isRound
      />

      <Box p={4} borderWidth="1px" borderRadius="md" w="full">
        <Text>{transcript || "Start speaking to your AI tutor..."}</Text>
      </Box>

      {error && <Text color="red.500">{error}</Text>}

      <Text>{isSpeaking ? "AI is speaking..." : "AI is not speaking."}</Text>
      <Button onClick={() => speak("Hello, this is your AI tutor.")}>
        Let AI Speak
      </Button>
    </VStack>
  );
}
