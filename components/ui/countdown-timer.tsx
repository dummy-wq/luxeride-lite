"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  expireAt: string | Date;
}

export function CountdownTimer({ expireAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expireAt).getTime() - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
      } else {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expireAt]);

  return <span>{timeLeft}</span>;
}
