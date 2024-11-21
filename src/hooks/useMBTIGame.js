import { MBTI_TYPES } from "@/constants";
import { useState } from "react";

export function useMBTIGame() {
  const [selectedMBTI, setSelectedMBTI] = useState(null);
  const [guessCount, setGuessCount] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);

  const calculateScore = (attempts) => {
    if (attempts >= 16) return 100;
    return Math.max(1700 - attempts * 100, 100);
  };

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * MBTI_TYPES.length);
    const randomMBTI = MBTI_TYPES[randomIndex];
    setSelectedMBTI(randomMBTI);
    setGuessCount(0);
    return randomMBTI;
  };

  return {
    selectedMBTI,
    setSelectedMBTI,
    guessCount,
    setGuessCount,
    showFireworks,
    setShowFireworks,
    calculateScore,
    startNewGame
  };
}
