import { MBTI_COLORS } from "@/constants";

export function MessageList({
  messages,
  currentUser,
  selectedMBTI,
  messagesEndRef,
  isRandomChat = false
}) {
  const getMessageStyle = (message) => {
    if (message.role === "user") {
      return "ml-auto bg-gray-700 text-white";
    }
    if (message.role === "system") {
      return "bg-gray-100 text-gray-700";
    }
    if (message.mbti && MBTI_COLORS[message.mbti]) {
      if (isRandomChat) {
        return "bg-blue-500 text-white";
      }
      return `${MBTI_COLORS[message.mbti].chat} text-white`;
    }
    // 기본 assistant 메시지 스타일
    return `${
      selectedMBTI ? MBTI_COLORS[selectedMBTI].chat : "bg-blue-500"
    } text-white`;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={message.timestamp || index}
          className={`p-4 rounded-2xl shadow-sm max-w-[85%] ${getMessageStyle(
            message
          )}`}
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
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
