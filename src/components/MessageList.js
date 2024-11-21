export function MessageList({ messages, currentUser }) {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div key={message.timestamp || index}>
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
        </div>
      ))}
    </div>
  );
}
