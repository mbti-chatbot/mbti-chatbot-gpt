import { Send } from "lucide-react";

export function ChatInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
  handleGuess
}) {
  return (
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
          onClick={handleGuess}
          className="px-6 py-3 bg-green-500 text-white rounded-xl
                   hover:bg-green-600
                   flex items-center gap-2 shadow-sm hover:shadow-md
                   transition-all duration-200"
        >
          <span>MBTI 맞추기</span>
        </button>
      </form>
    </div>
  );
}
