// src/pages/index.js
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send } from "lucide-react";

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

const MBTI_COLORS = {
  I: { bg: "bg-blue-100 hover:bg-blue-200", selected: "bg-blue-500" },
  E: { bg: "bg-green-100 hover:bg-green-200", selected: "bg-green-500" },
  S: { bg: "bg-purple-100 hover:bg-purple-200", selected: "bg-purple-500" },
  N: { bg: "bg-pink-100 hover:bg-pink-200", selected: "bg-pink-500" },
  T: { bg: "bg-orange-100 hover:bg-orange-200", selected: "bg-orange-500" },
  F: { bg: "bg-teal-100 hover:bg-teal-200", selected: "bg-teal-500" },
  J: { bg: "bg-indigo-100 hover:bg-indigo-200", selected: "bg-indigo-500" },
  P: { bg: "bg-amber-100 hover:bg-amber-200", selected: "bg-amber-500" }
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMBTI, setSelectedMBTI] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getButtonStyle = (mbti) => {
    const baseStyle =
      "px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5";
    const isSelected = selectedMBTI === mbti;
    const colorStyle = isSelected
      ? `${MBTI_COLORS[mbti[0]].selected} text-white`
      : `${MBTI_COLORS[mbti[0]].bg} text-gray-700`;
    return `${baseStyle} ${colorStyle}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
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
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `Error: ${
            error.response?.data?.error || "요청 처리 중 오류가 발생했습니다."
          }`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            MBTI Chatbot with GPT-4
          </h1>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Choose your personality type:
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {MBTI_TYPES.map((mbti) => (
                <button
                  key={mbti}
                  onClick={() => setSelectedMBTI(mbti)}
                  className={getButtonStyle(mbti)}
                >
                  {mbti}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-2xl shadow-sm max-w-[85%] 
                ${
                  message.role === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : message.role === "system"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-white text-gray-700"
                }
              `}
            >
              <div className="text-sm font-medium mb-1 opacity-75">
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
            <div className="flex justify-center p-4">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 rounded-xl border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl
                     hover:bg-blue-600 disabled:opacity-50
                     flex items-center gap-2 shadow-sm hover:shadow-md
                     transition-all duration-200"
          >
            <Send className="h-5 w-5" />
            <span className="hidden sm:inline">전송</span>
          </button>
        </form>
      </div>
    </div>
  );
}
