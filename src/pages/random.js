import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, RefreshCw, Link } from "lucide-react";
import { MBTI_COLORS, getEnhancedPrompt } from "@/constants/mbti";
import UserModal from "@/components/UserModal";
import Fireworks from "@/components/Fireworks";

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
  const [showUserModal, setShowUserModal] = useState(false);
  const [guess, setGuess] = useState("");
  const [guessResult, setGuessResult] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [revealedMBTI, setRevealedMBTI] = useState(false);
  const messagesEndRef = useRef(null);
  const [guessCount, setGuessCount] = useState(0); // 추가: 시도 횟수 카운트

  // 랜덤 MBTI 선택
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
    if (users.length === 0) {
      setShowUserModal(true);
    }
    startNewChat();
  }, []);

  // 점수 계산 함수
  const calculateScore = (attempts) => {
    if (attempts >= 16) return 100; // 16번 이상 시도했으면 100점
    return Math.max(1700 - attempts * 100, 100); // 시도마다 100점씩 감소
  };

  const handleAction = (action) => {
    if (action === "new") {
      // 새로운 랜덤 대화 시작
      setMessages([]);
      setGuessCount(0);
      startNewChat();
    } else if (action === "continue") {
      // 이어서 대화하기
      setRevealedMBTI(true);
    }
  };

  const startNewChat = () => {
    const randomIndex = Math.floor(Math.random() * MBTI_TYPES.length);
    const randomMBTI = MBTI_TYPES[randomIndex];
    setSelectedMBTI(randomMBTI);
    setRevealedMBTI(false);
    setMessages([
      {
        role: "system",
        content:
          "랜덤 MBTI가 선택되었습니다. 대화를 나누면서 상대방의 MBTI를 맞춰보세요!",
        visible: true,
        timestamp: new Date().getTime()
      }
    ]);
  };

  const handleUserSelect = (user) => {
    setCurrentUser(user);
    setShowUserModal(false);
    startNewChat();
  };

  const handleCorrectGuess = () => {
    setShowFireworks(true);

    // 점수 업데이트
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          return { ...u, score: (u.score || 0) + 1 };
        }
        return u;
      });
      localStorage.setItem("mbtiUsers", JSON.stringify(updatedUsers));
      setCurrentUser({ ...currentUser, score: currentUser.score + 1 });
    }

    // 3초 후 폭죽 효과 제거
    setTimeout(() => {
      setShowFireworks(false);
    }, 3000);

    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        content: `정답입니다! 상대방의 MBTI는 ${selectedMBTI}입니다!`,
        visible: true,
        timestamp: new Date().getTime()
      },
      {
        role: "system",
        content: "다음 중 선택해주세요:",
        buttons: [
          { text: "새로운 랜덤 대화 시작", action: "new" },
          { text: "이어서 대화하기", action: "continue" }
        ],
        visible: true,
        timestamp: new Date().getTime() + 1
      }
    ]);

    setRevealedMBTI(true);
  };

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

    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);

    const isCorrect = guess === selectedMBTI;
    setGuessResult(isCorrect);

    if (isCorrect) {
      // 정답인 경우
      setShowFireworks(true);
      const score = calculateScore(newGuessCount);

      // 사용자 점수 업데이트
      if (currentUser) {
        const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
        const updatedUsers = users.map((u) => {
          if (u.id === currentUser.id) {
            return { ...u, score: (u.score || 0) + score };
          }
          return u;
        });
        localStorage.setItem("mbtiUsers", JSON.stringify(updatedUsers));
        setCurrentUser({ ...currentUser, score: currentUser.score + score });
      }

      // 시스템 메시지 추가
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `정답입니다! 상대방의 MBTI는 ${selectedMBTI}입니다! (획득 점수: ${score}점) ${selectedMBTI}와 더 많은 대화를 나눠보세요! 새로운 랜덤 MBTI와 대화하시려면 아래 버튼을 눌러주세요.`,
          timestamp: new Date().getTime()
        },
        {
          role: "system",
          content: "다음 중 선택해주세요",
          buttons: [{ text: "새로운 랜덤 대화 시작", action: "new" }],
          timestamp: new Date().getTime() + 1
        }
      ]);

      // 3초 후 폭죽 효과 제거
      setTimeout(() => {
        setShowFireworks(false);
      }, 3000);
    } else {
      // 오답인 경우
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "틀렸습니다! 다시 대화를 나누면서 맞춰보세요!",
          timestamp: new Date().getTime()
        }
      ]);
    }

    setShowModal(false);
  };
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 relative">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 사용자 정보 및 전환 버튼 */}
            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="text-sm">
                  <span className="font-medium">{currentUser.name}</span>
                  <span className="ml-2 text-gray-600">
                    점수: {currentUser.score}점
                  </span>
                </div>
              )}
              <button
                onClick={() => setShowUserModal(true)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                사용자 전환
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFireworks && <Fireworks />}

      {/* 새로운 랜덤 대화 버튼 (MBTI가 공개된 경우에만 표시) */}
      {revealedMBTI && (
        <button
          onClick={startNewChat}
          className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600"
        >
          <RefreshCw className="h-4 w-4" />
          새로운 랜덤 대화
        </button>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={message.timestamp || index}>
              {!message.buttons ? (
                <div
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
                      ? currentUser?.name || "You"
                      : message.role === "system"
                      ? "System"
                      : "Assistant"}
                  </div>
                  <div>{message.content}</div>
                </div>
              ) : (
                <div className="flex justify-center gap-4 my-4">
                  {message.buttons.map((button, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(button.action)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
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

      {/* 모달들 */}
      {showUserModal && (
        <UserModal
          onClose={() => setShowUserModal(false)}
          onSubmit={handleUserSelect}
          currentUser={currentUser}
        />
      )}
      {/* MBTI 추측 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              상대방의 MBTI를 맞춰보세요!
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              현재 시도 횟수: {guessCount + 1}회
              {guessCount < 16
                ? ` (맞추면 ${calculateScore(guessCount + 1)}점)`
                : " (맞추면 100점)"}
            </p>
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
