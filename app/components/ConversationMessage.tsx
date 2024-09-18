"use client";

import { Box, Text } from "@chakra-ui/react";

interface ConversationMessageProps {
  //   sender: "user" | "ai";
  sender: string;
  text: string;
  isTranscribing?: boolean;
}

export default function ConversationMessage({
  sender,
  text,
  isTranscribing,
}: ConversationMessageProps) {
  const isUser = sender === "user";

  return (
    <Box
      alignSelf={isUser ? "flex-end" : "flex-start"}
      maxWidth={{ base: "100%", md: "80%" }}
    >
      <Box
        bg={isUser ? "teal.500" : "gray.700"}
        color="white"
        p={3}
        borderRadius="md"
        opacity={isTranscribing ? 0.7 : 1}
        fontStyle={isTranscribing ? "italic" : "normal"}
      >
        <Text>{text}</Text>
      </Box>
    </Box>
  );
}
