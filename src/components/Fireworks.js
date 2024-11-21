import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Fireworks() {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: randomInRange(60, 120),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 }
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return null;
}
