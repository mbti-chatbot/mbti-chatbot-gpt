import { useChat } from "@/hooks/useChat";
import { useState } from "react";
import { MessageList, ChatInput } from "@/components";
import { MBTI_COLORS, MBTI_TYPES, getEnhancedPrompt } from "@/constants/mbti";

export default function Home() {
  const {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    sendMessage,
    messagesEndRef
  } = useChat();

  const [selectedMBTI, setSelectedMBTI] = useState(null);

  const handleMBTISelect = (mbti) => {
    setSelectedMBTI(mbti);
    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        content: `MBTI가 ${mbti}로 설정되었습니다.`,
        timestamp: Date.now()
      }
    ]);
  };

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

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="p-4 bg-white border-b">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {MBTI_TYPES.map((mbti) => (
              <button
                key={mbti}
                onClick={() => handleMBTISelect(mbti)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    selectedMBTI === mbti
                      ? `${MBTI_COLORS[mbti].selected} text-white`
                      : `${MBTI_COLORS[mbti].bg} text-gray-700`
                  }
                `}
              >
                {mbti}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          selectedMBTI={selectedMBTI}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
