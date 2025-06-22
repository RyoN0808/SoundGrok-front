"use client";

import React from "react";

interface Props {
  artistName: string;
  averageScore: number;
  songCount: number;
}

const getScoreStyle = (score: number) => {
  if (score >= 95) {
    return {
      border: "border-yellow-400",
      innerBorder: "border-yellow-300",
      bg: "from-yellow-500/30",
      text: "from-yellow-300 via-yellow-200 to-yellow-500",
      stroke: "#FACC15",
    };
  } else if (score >= 90) {
    return {
      border: "border-purple-400",
      innerBorder: "border-purple-300",
      bg: "from-purple-500/30",
      text: "from-purple-300 via-purple-200 to-purple-500",
      stroke: "#C084FC",
    };
  } else if (score >= 80) {
    return {
      border: "border-blue-400",
      innerBorder: "border-blue-300",
      bg: "from-blue-500/30",
      text: "from-blue-300 via-blue-200 to-blue-500",
      stroke: "#60A5FA",
    };
  } else {
    return {
      border: "border-pink-400",
      innerBorder: "border-pink-300",
      bg: "from-pink-500/30",
      text: "from-pink-300 via-pink-200 to-pink-500",
      stroke: "#F472B6",
    };
  }
};

export default function ArtistCard({ artistName, averageScore, songCount }: Props) {
  const style = getScoreStyle(averageScore);

  return (
    <div className={`p-[6px] rounded-2xl border-2 ${style.border} w-40 sm:w-48 h-auto shadow-md`}>
      <div className={`relative rounded-xl border ${style.innerBorder} bg-gradient-to-tl ${style.bg} to-black px-4 py-4 text-white overflow-hidden`}>
        {/* SVG角飾り */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 140" preserveAspectRatio="none">
          <path d="M0,10 Q0,0 10,0" stroke={style.stroke} strokeWidth="1" fill="none" />
          <path d="M100,10 Q100,0 90,0" stroke={style.stroke} strokeWidth="1" fill="none" />
          <path d="M0,130 Q0,140 10,140" stroke={style.stroke} strokeWidth="1" fill="none" />
          <path d="M100,130 Q100,140 90,140" stroke={style.stroke} strokeWidth="1" fill="none" />
        </svg>

        {/* タイトル */}
        <h3 className="text-sm font-bold text-white leading-tight">平均</h3>
        <p className="text-xs text-gray-300 leading-snug">{artistName}</p>

        {/* スコア */}
        <p
          className={`mt-3 text-2xl font-bold text-transparent bg-clip-text 
                      bg-gradient-to-r ${style.text} relative 
                      after:content-[''] after:absolute after:bottom-[-2px] after:left-0 
                      after:w-full after:h-[1px] after:bg-white/30 after:opacity-50 after:blur-sm after:rounded-full`}
        >
          {averageScore.toFixed(3)}
        </p>

        {/* 登録曲数 */}
        <div
          className="mt-3 inline-flex items-center gap-1 text-xs px-2 py-0.5 
                     bg-white/10 backdrop-blur-sm shadow-inner rounded border border-white/20"
        >
          <span>🎤</span>
          <span>×{songCount}</span>
        </div>
      </div>
    </div>
  );
}
