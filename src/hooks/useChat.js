import { useState, useEffect } from "react";
import axios from "axios";
import { getEnhancedPrompt } from "@/constants/mbti";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message, systemPrompt) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/chat", {
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.filter((msg) => msg.role !== "system"),
          message
        ]
      });
      return response.data.message;
    } catch (error) {
      console.error("Chat error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    sendMessage
  };
}
