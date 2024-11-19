// src/pages/index.js
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const MBTI_TYPES = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ"
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMBTI, setSelectedMBTI] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMBTISelect = (mbti) => {
    setSelectedMBTI(mbti);
    // MBTI가 선택되면 시스템 메시지로 추가
    const systemMessage = {
      role: "system",
      content: `Selected personality type: ${mbti}`
    };
    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input
    };

    // MBTI 정보를 포함한 메시지 배열 생성
    const messagesWithMBTI = selectedMBTI
      ? [
          { role: "system", content: `User MBTI: ${selectedMBTI}` },
          ...messages,
          userMessage
        ]
      : [...messages, userMessage];

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/chat", {
        messages: messagesWithMBTI
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
      {/* MBTI 선택 섹션 */}
      <div className="bg-white border-b border-chatbot-border p-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-3">Select your MBTI type:</h2>
          <div className="grid grid-cols-4 gap-2 md:grid-cols-8 lg:grid-cols-8">
            {MBTI_TYPES.map((mbti) => (
              <button
                key={mbti}
                onClick={() => handleMBTISelect(mbti)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    selectedMBTI === mbti
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {mbti}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 채팅 메시지 섹션 */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-white"
                  : message.role === "system"
                  ? "bg-gray-100"
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

      {/* 입력창 섹션 */}
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
