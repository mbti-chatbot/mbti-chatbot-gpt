import { useEffect, useState } from "react";
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
  const [showGuessModal, setShowGuessModal] = useState(false);

  const {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    sendMessage,
    initializeChat,
    messagesEndRef
  } = useChat();

  const {
    currentUser,
    showUserModal,
    setShowUserModal,
    updateUserScore,
    selectUser
  } = useUser();

  const {
    selectedMBTI,
    guessCount,
    setGuessCount,
    showFireworks,
    setShowFireworks,
    isMBTIRevealed,
    setIsMBTIRevealed,
    calculateScore,
    startNewGame
  } = useMBTIGame();

  // 초기 메시지 설정
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      const mbti = startNewGame();
      initializeChat(
        "랜덤 MBTI와 대화를 진행해 보세요! 대화를 나누면서 상대방의 MBTI가 무엇일지 맞춰보세요."
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedMBTI) return;

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
          timestamp: Date.now(),
          mbti: selectedMBTI
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

  // src/pages/random.js
  const handleGuess = async (guess) => {
    if (!currentUser) {
      setShowUserModal(true);
      return;
    }

    const isCorrect = guess === selectedMBTI;
    const score = calculateScore(guessCount + 1);

    if (isCorrect) {
      setShowFireworks(true);
      setIsMBTIRevealed(true);

      // currentUser가 있는지 확인 후 점수 업데이트
      if (currentUser?.id) {
        updateUserScore(currentUser.id, score);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `정답입니다! 상대방의 MBTI는 ${selectedMBTI}입니다! (획득 점수: ${score}점)
새로운 대화를 시작하시겠습니까?`,
          timestamp: Date.now()
        }
      ]);

      setTimeout(() => {
        setShowFireworks(false);
        startNewGame();
        initializeChat(
          "새로운 MBTI와의 대화가 시작되었습니다! 상대방의 MBTI를 맞춰보세요."
        );
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
    <div className="flex-1 flex flex-col relative">
      {showFireworks && <Fireworks />}

      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          currentUser={currentUser}
          selectedMBTI={selectedMBTI}
          messagesEndRef={messagesEndRef}
          isRandomChat={true}
        />
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        handleGuess={() => !isMBTIRevealed && setShowGuessModal(true)}
        disabled={isMBTIRevealed}
        isRandomChat={true}
      />

      <GuessModal
        isOpen={showGuessModal}
        onClose={() => setShowGuessModal(false)}
        onGuess={handleGuess}
        guessCount={guessCount}
        calculateScore={calculateScore}
      />

      {/* {showUserModal && (
        <UserModal
          onClose={() => setShowUserModal(false)}
          onSubmit={(user) => {
            if (user.id === currentUser?.id) {
              switchUser(user);
            } else {
              selectUser(user);
            }
          }}
          currentUser={currentUser}
          forceAdd={!currentUser && !localStorage.getItem("mbtiUsers")}
        />
      )} */}
    </div>
  );
}
