import { useState, useEffect } from "react";
import { MBTI_TYPES } from "@/constants/mbti";

export function useMBTIGame() {
  const [selectedMBTI, setSelectedMBTI] = useState(null);
  const [guessCount, setGuessCount] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isMBTIRevealed, setIsMBTIRevealed] = useState(false);

  const calculateScore = (attempts) => {
    if (attempts >= 16) return 100;
    return Math.max(1700 - attempts * 100, 100);
  };

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * MBTI_TYPES.length);
    const randomMBTI = MBTI_TYPES[randomIndex];
    setSelectedMBTI(randomMBTI);
    setGuessCount(0);
    setIsMBTIRevealed(false);
    return randomMBTI;
  };

  return {
    selectedMBTI,
    guessCount,
    setGuessCount,
    showFireworks,
    setShowFireworks,
    isMBTIRevealed,
    setIsMBTIRevealed,
    calculateScore,
    startNewGame
  };
}
