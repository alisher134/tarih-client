"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";
import { formatDuration } from "@/shared/lib/format-duration";

type TestTimerProps = {
  startedAt: string;
  timeLimit: number;
  onExpire: () => void;
};

export function TestTimer({ startedAt, timeLimit, onExpire }: TestTimerProps) {
  const endsAt = new Date(startedAt).getTime() + timeLimit * 1000;
  const onExpireRef = useRef(onExpire);
  const hasExpiredRef = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((endsAt - Date.now()) / 1000)),
  );

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (hasExpiredRef.current) return;

    if (secondsLeft <= 0) {
      hasExpiredRef.current = true;
      onExpireRef.current();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [secondsLeft]);

  const progress = Math.max(0, Math.min(100, (secondsLeft / timeLimit) * 100));
  const isLowTime = secondsLeft < 60 && timeLimit > 60;

  // SVG parameters
  const size = 90;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 flex items-center justify-center rounded-full bg-card p-1 shadow-2xl transition-transform hover:scale-105">
      <svg
        width={size}
        height={size}
        className={cn("-rotate-90 transform", isLowTime && "animate-pulse")}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          className={cn("text-primary/10", isLowTime && "text-destructive/20")}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          className={cn(
            "transition-all duration-1000 ease-linear text-primary",
            isLowTime && "text-destructive",
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-base font-bold tabular-nums tracking-tight",
            isLowTime ? "text-destructive" : "text-foreground",
          )}
        >
          {formatDuration(secondsLeft)}
        </span>
      </div>
    </div>
  );
}
