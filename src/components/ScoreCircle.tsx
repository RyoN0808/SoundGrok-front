"use client";

import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
  averageScore: number;
};

function getVisual(score: number) {
  if (score >= 95) {
    return { percent: ((score - 95) / 5) * 100, label: "SS", gradientId: "grad-ss" };
  } else if (score >= 90) {
    return { percent: ((score - 90) / 5) * 100, label: "SA", gradientId: "grad-sa" };
  } else if (score >= 85) {
    return { percent: ((score - 85) / 5) * 100, label: "S", gradientId: "grad-s" };
  } else if (score >= 80) {
    return { percent: ((score - 80) / 5) * 100, label: "A", gradientId: "grad-a" };
  } else if (score >= 70) {
    return { percent: ((score - 70) / 10) * 100, label: "B", gradientId: "grad-b" };
  } else {
    return { percent: ((score - 0) / 70) * 100, label: "C", gradientId: "grad-c" };
  }
}

export default function ScoreCircle({ averageScore }: Props) {
  const { percent, label, gradientId } = getVisual(averageScore);

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* 放射グローエフェクト */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 via-pink-400/10 to-purple-400/10 blur-2xl z-0" />

      {/* SVGグラデーション定義 */}
      <svg style={{ height: 0, width: 0, position: "absolute" }}>
        <defs>
          <linearGradient id="grad-c" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#6B7280" />
          </linearGradient>
          <linearGradient id="grad-b" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="grad-a" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="grad-s" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="grad-sa" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="grad-ss" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      <CircularProgressbarWithChildren
        value={percent}
        maxValue={100}
        circleRatio={0.8}
        strokeWidth={10}
        styles={buildStyles({
          rotation: 0.6,
          pathColor: `url(#${gradientId})`,
          trailColor: "#1F2937",
          strokeLinecap: "round",
        })}
      >
        <div className="flex flex-col items-center text-center text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600">
  <div className="text-4xl font-bold">{averageScore.toFixed(2)}</div>
  <div className="text-sm mt-1 tracking-widest">ランク: {label}</div>
</div>

      </CircularProgressbarWithChildren>
    </div>
  );
}
