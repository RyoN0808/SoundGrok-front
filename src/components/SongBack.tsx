"use client";

import React from "react";

interface SongBackProps {
  highestScore?: number;
  lastScores?: number[];
  playCount?: number;
}

const SongBack: React.FC<SongBackProps> = ({
  highestScore = 0,
  lastScores = [],
  playCount = 0,
}) => {
  const maxScore = Math.max(...lastScores, highestScore);
  const minScore = Math.min(...lastScores, highestScore);
  const pointCount = lastScores.length;

  const points = lastScores
    .map((score, idx) => {
      const x = (idx / (pointCount - 1)) * 100;
      const norm = (score - minScore) / (maxScore - minScore || 1);
      const y = 100 - (norm * 80 + 10);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div
      className="relative max-w-sm sm:max-w-md mx-auto p-4 sm:p-6 border-[3px] border-amber-500
                 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl
                 shadow-[0_0_30px_rgba(255,191,0,0.3)]"
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {/* タイトル */}
      <h2 className="text-sm tracking-widest text-center text-amber-400 mb-2">
        HIGHEST SCORE
      </h2>
      <p
        className="text-6xl font-extrabold text-center text-transparent bg-clip-text
                   bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-300"
      >
        {highestScore.toFixed(3)}
      </p>

      {/* グラフエリア */}
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 mt-6 mb-4">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-24"
        >
          <polyline
            points={points}
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            className="stroke-amber-400"
          />
        </svg>
        <div className="flex justify-between text-xs text-gray-300 mt-2">
          {lastScores.map((score, idx) => (
            <span key={idx}>{score.toFixed(1)}</span>
          ))}
        </div>
      </div>

      {/* 再生数 */}
      <div className="text-center text-amber-300 font-semibold text-sm">
        PLAY COUNT
        <br />
        <span className="text-2xl font-bold tracking-wider">×{playCount}</span>
      </div>

      {/* 四隅の飾り */}
      <svg className="absolute top-0 left-0 w-6 h-6 text-amber-600 stroke-current">
        <path d="M0,6 Q0,0 6,0" strokeWidth={2} fill="none" strokeLinecap="round" />
      </svg>
      <svg className="absolute top-0 right-0 w-6 h-6 text-amber-600 stroke-current transform rotate-90 origin-top-right">
        <path d="M0,6 Q0,0 6,0" strokeWidth={2} fill="none" strokeLinecap="round" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-6 h-6 text-amber-600 stroke-current transform -rotate-90 origin-bottom-left">
        <path d="M0,6 Q0,0 6,0" strokeWidth={2} fill="none" strokeLinecap="round" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-6 h-6 text-amber-600 stroke-current transform rotate-180 origin-bottom-right">
        <path d="M0,6 Q0,0 6,0" strokeWidth={2} fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default SongBack;