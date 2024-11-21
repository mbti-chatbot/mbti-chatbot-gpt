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

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMBTI, setSelectedMBTI] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // getButtonStyle 함수
  const getButtonStyle = (mbti) => {
    const baseStyle =
      "px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5";
    const isSelected = selectedMBTI === mbti;
    const colorStyle = isSelected
      ? `${MBTI_COLORS[mbti].selected} text-white`
      : `${MBTI_COLORS[mbti].bg} text-gray-700`;
    return `${baseStyle} ${colorStyle}`;
  };

  const handleMbtiSelect = (mbti) => {
    const prevMbti = selectedMBTI;
    setSelectedMBTI(mbti);

    // UI에 표시될 변경 알림 메시지만 추가
    const changeMessage = {
      role: "system",
      content: `MBTI가 ${
        prevMbti ? prevMbti + "에서 " : ""
      }${mbti}로 변경되었습니다. 이제부터 ${mbti} 성격의 AI가 응답합니다.`,
      timestamp: new Date().getTime(),
      visible: true // UI 표시 여부를 결정하는 플래그
    };

    setMessages((prev) => [...prev, changeMessage]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedMBTI) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().getTime(),
      mbti: selectedMBTI,
      visible: true
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // API 요청 시에만 프롬프트 포함
      const response = await axios.post("/api/chat", {
        messages: [
          {
            role: "system",
            content: getEnhancedPrompt(selectedMBTI)
          },
          // visible이 true인 메시지만 포함
          ...messages.filter((msg) => msg.visible !== false),
          userMessage
        ]
      });

      const assistantMessage = {
        role: "assistant",
        content: response.data.message,
        timestamp: new Date().getTime(),
        mbti: selectedMBTI,
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

  const MessageBubble = ({ message, index }) => {
    // visible이 false인 메시지는 렌더링하지 않음
    if (message.visible === false) return null;

    const getMessageStyle = () => {
      if (message.role === "user") {
        return "ml-auto bg-gray-700 text-white";
      } else if (message.role === "system") {
        return "bg-gray-100 text-gray-700";
      } else {
        return message.mbti
          ? `${MBTI_COLORS[message.mbti].chat} text-white`
          : "bg-blue-500 text-white";
      }
    };

    return (
      <div
        className={`
        p-4 rounded-2xl shadow-sm max-w-[85%] 
        ${getMessageStyle()}
      `}
      >
        <div className="text-sm font-medium mb-1 opacity-75">
          {message.role === "user"
            ? "You"
            : message.role === "system"
            ? "System"
            : message.mbti || "Assistant"}
        </div>
        <div>{message.content}</div>
      </div>
    );
  };

  // 메시지 표시 부분에 대화 초기화 버튼 추가
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              MBTI Chatbot with AI
            </h1>
            {/* 대화 초기화 버튼 추가 */}
            <button
              onClick={() => {
                if (window.confirm("대화 내용을 초기화하시겠습니까?")) {
                  setMessages(
                    selectedMBTI
                      ? [
                          {
                            role: "system",
                            content: `AI는 ${selectedMBTI}의 성격을 매우 강하게 가진 AI이고, 너의 대답은 항상 ${selectedMBTI}의 말투로 사용자에게 제공한다. AI는 다른 건 전혀 고려하지 않고, ${selectedMBTI}의 성향에 맞는 답변을 사용자에게 제공한다.`
                          }
                        ]
                      : []
                  );
                }
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              대화 초기화
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Choose your personality type:
              </h2>
              {selectedMBTI && MBTI_COLORS[selectedMBTI] && (
                <span
                  className={`px-4 py-2 rounded-lg font-bold ${MBTI_COLORS[selectedMBTI].selected} text-white`}
                >
                  {selectedMBTI}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {MBTI_TYPES.map((mbti) => (
                <button
                  key={mbti}
                  onClick={() => handleMbtiSelect(mbti)}
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
            <MessageBubble
              key={message.timestamp || index}
              message={message}
              index={index}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area와 Footer */}
      <div className="sticky bottom-0">
        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto flex gap-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedMBTI
                  ? "메시지를 입력하세요..."
                  : "MBTI를 먼저 선택해주세요"
              }
              className="flex-1 rounded-xl border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading || !selectedMBTI}
            />
            <button
              type="submit"
              disabled={isLoading || !selectedMBTI}
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
    </div>
  );
}
