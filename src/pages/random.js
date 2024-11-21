import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import { MBTI_COLORS, getEnhancedPrompt } from "@/constants/mbti";

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

export default function RandomChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMBTI, setSelectedMBTI] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [guess, setGuess] = useState("");
  const [guessResult, setGuessResult] = useState(null);
  const messagesEndRef = useRef(null);

  // 랜덤 MBTI 선택
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MBTI_TYPES.length);
    const randomMBTI = MBTI_TYPES[randomIndex];
    setSelectedMBTI(randomMBTI);

    // 시스템 메시지 설정
    setMessages([
      {
        role: "system",
        content:
          "랜덤 MBTI가 선택되었습니다. 대화를 나누면서 상대방의 MBTI를 맞춰보세요!",
        visible: true,
        timestamp: new Date().getTime()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedMBTI) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().getTime(),
      visible: true
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        messages: [
          {
            role: "system",
            content: getEnhancedPrompt(selectedMBTI)
          },
          ...messages.filter((msg) => msg.role !== "system"),
          userMessage
        ]
      });

      const assistantMessage = {
        role: "assistant",
        content: response.data.message,
        timestamp: new Date().getTime(),
        visible: true
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: "system",
        content: `Error: ${
          error.response?.data?.error || "요청 처리 중 오류가 발생했습니다."
        }`,
        timestamp: new Date().getTime(),
        visible: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = () => {
    if (!guess) return;

    const isCorrect = guess === selectedMBTI;
    setGuessResult(isCorrect);

    const resultMessage = {
      role: "system",
      content: isCorrect
        ? `정답입니다! 상대방의 MBTI는 ${selectedMBTI}입니다!`
        : `틀렸습니다! 다시 대화를 나누면서 맞춰보세요!`,
      visible: true,
      timestamp: new Date().getTime()
    };

    setMessages((prev) => [...prev, resultMessage]);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages
            .filter((m) => m.visible)
            .map((message, index) => (
              <div
                key={message.timestamp || index}
                className={`
                p-4 rounded-2xl shadow-sm max-w-[85%] 
                ${
                  message.role === "user"
                    ? "ml-auto bg-gray-700 text-white"
                    : message.role === "system"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-blue-500 text-white"
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
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-green-500 text-white rounded-xl
                     hover:bg-green-600 
                     flex items-center gap-2 shadow-sm hover:shadow-md
                     transition-all duration-200"
          >
            <span>MBTI 맞추기</span>
          </button>
        </form>
      </div>

      {/* Guess Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              상대방의 MBTI를 맞춰보세요!
            </h2>
            <select
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="">MBTI 선택</option>
              {MBTI_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                onClick={handleGuess}
                disabled={!guess}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
