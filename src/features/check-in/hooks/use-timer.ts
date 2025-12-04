"use client";

import { useState, useEffect, useCallback } from "react";

export function useTimer(startTime: Date | null) {
  const [elapsed, setElapsed] = useState("00:00");
  const [currentTime, setCurrentTime] = useState("00:00:00");

  const formatElapsed = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const formatCurrentTime = useCallback((date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }, []);

  useEffect(() => {
    if (!startTime) return;

    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      setElapsed(formatElapsed(diff));
      setCurrentTime(formatCurrentTime(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [startTime, formatElapsed, formatCurrentTime]);

  return { elapsed, currentTime };
}

