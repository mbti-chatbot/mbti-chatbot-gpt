import { useState } from "react";
import { MBTI_TYPES } from "@/constants/mbti";

export function GuessModal({
  isOpen,
  onClose,
  onGuess,
  guessCount,
  calculateScore
}) {
  const [guess, setGuess] = useState("");

  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            취소
          </button>
          <button
            onClick={() => {
              onGuess(guess);
              setGuess("");
            }}
            disabled={!guess}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
