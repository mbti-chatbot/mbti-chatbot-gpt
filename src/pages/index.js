import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/chat", {
        messages: [...messages, userMessage]
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.message
        }
      ]);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.response?.data?.error ||
          "An error occurred while processing your request"
      );

      // 에러 메시지를 채팅창에 표시
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `Error: ${
            error.response?.data?.error ||
            "An error occurred while processing your request"
          }`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-chatbot-light">
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-white"
                  : message.role === "system"
                  ? "bg-red-100"
                  : "bg-chatbot-light"
              }`}
            >
              <div className="font-medium mb-1">
                {message.role === "user"
                  ? "You"
                  : message.role === "system"
                  ? "System"
                  : "Assistant"}
              </div>
              <div>{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t border-chatbot-border bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 rounded-lg border border-chatbot-border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              전송
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
