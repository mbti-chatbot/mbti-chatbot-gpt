import { useState, useEffect, useRef } from "react";
import { useChat, useUser, useMBTIGame } from "@/hooks";
import {
  MessageList,
  ChatInput,
  GuessModal,
  Fireworks,
  UserModal
} from "@/components";
import { getEnhancedPrompt } from "@/constants";

export default function RandomChat() {
  const { messages, setMessages, input, setInput, isLoading, sendMessage } =
    useChat();

  const {
    currentUser,
    setCurrentUser,
    showUserModal,
    setShowUserModal,
    updateUserScore
  } = useUser();

  const {
    selectedMBTI,
    guessCount,
    setGuessCount,
    showFireworks,
    setShowFireworks,
    calculateScore,
    startNewGame
  } = useMBTIGame();

  const [showGuessModal, setShowGuessModal] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // 현재 사용자 정보 업데이트
    if (currentUser) {
      const nameElement = document.getElementById("current-user-name");
      const scoreElement = document.getElementById("current-user-score");
      if (nameElement) nameElement.textContent = currentUser.name;
      if (scoreElement)
        scoreElement.textContent = `점수: ${currentUser.score}점`;
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await sendMessage(
        userMessage,
        getEnhancedPrompt(selectedMBTI)
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          timestamp: Date.now()
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "오류가 발생했습니다. 다시 시도해주세요.",
          timestamp: Date.now()
        }
      ]);
    }
  };

  const handleGuess = async (guess) => {
    const isCorrect = guess === selectedMBTI;
    const score = calculateScore(guessCount + 1);

    if (isCorrect) {
      setShowFireworks(true);
      updateUserScore(currentUser.id, score);

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `정답입니다! 상대방의 MBTI는 ${selectedMBTI}입니다! (획득 점수: ${score}점)
새로운 대화를 시작합니다.`,
          timestamp: Date.now()
        }
      ]);

      setTimeout(() => {
        setShowFireworks(false);
        startNewGame();
        setMessages([]);
      }, 3000);
    } else {
      setGuessCount((prev) => prev + 1);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "틀렸습니다! 다시 대화를 나누면서 맞춰보세요!",
          timestamp: Date.now()
        }
      ]);
    }

    setShowGuessModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] relative">
      {showFireworks && <Fireworks />}

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} currentUser={currentUser} />
      </div>

      {/* 입력 영역 - 하단에 고정 */}
      <div className="sticky bottom-0 w-full">
        <ChatInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          handleGuess={() => setShowGuessModal(true)}
        />
      </div>

      <GuessModal
        isOpen={showGuessModal}
        onClose={() => setShowGuessModal(false)}
        onGuess={handleGuess}
        guessCount={guessCount}
        calculateScore={calculateScore}
      />

      {showUserModal && (
        <UserModal
          onClose={() => setShowUserModal(false)}
          onSubmit={(user) => {
            setCurrentUser(user);
            setShowUserModal(false);
          }}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
