import { useState, useRef, useEffect } from "react";
import axios from "axios";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const initializeChat = (initialMessage) => {
    setMessages([
      {
        role: "system",
        content: initialMessage,
        timestamp: Date.now()
      }
    ]);
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    sendMessage,
    initializeChat,
    messagesEndRef
  };
}
