"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";

interface ScoreEntry {
  date: string;
  score: number;
}

interface SongDetailProps {
  isOpen: boolean;
  onClose: () => void;
  songName: string;
  artistName: string;
  averageScore: number;
  playCount: number;
  genre: string;
  genreIcon: string;
  lastScores: ScoreEntry[];
  highestScore: number;
}

export default function SongDetail({
  isOpen,
  onClose,
  songName,
  artistName,
  averageScore,
  playCount,
  genre,
  genreIcon,
  lastScores,
  highestScore,
}: SongDetailProps) {
  const [historyPage, setHistoryPage] = useState(0);
  const historyPageSize = 8;

  const sortedScores = [...lastScores].sort((a, b) => b.date.localeCompare(a.date));
  const paginatedHistory = sortedScores.slice(
    historyPage * historyPageSize,
    (historyPage + 1) * historyPageSize
  );
  const hasNext = (historyPage + 1) * historyPageSize < sortedScores.length;
  const hasPrev = historyPage > 0;

  const graphData = sortedScores.slice(0, 5).reverse();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md sm:max-w-xl max-h-screen overflow-y-auto rounded-xl bg-gradient-to-br from-neutral-900 to-black border border-neutral-700">
        <DialogClose
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
        >
          ×
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-center text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-500 text-2xl sm:text-3xl font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)] mb-2">
            {songName}
          </DialogTitle>
          <p className="text-center text-sm text-gray-400 mb-4">by {artistName}</p>
        </DialogHeader>

        <div className="text-white text-sm space-y-1">
          <p>
            スコア: <span className="font-mono text-yellow-300">{averageScore.toFixed(3)}</span>
          </p>
          <p>
            ジャンル: {genreIcon} {genre}
          </p>
          <p>歌唱回数: ×{playCount}</p>
          <p>
            最高スコア: <span className="font-bold text-xl sm:text-2xl text-yellow-300">{highestScore?.toFixed(3) ?? "―"}</span>
          </p>
        </div>

        <div className="h-40 sm:h-56 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={graphData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="date" hide />
              <YAxis domain={["dataMin - 1", "dataMax + 1"]} stroke="#888" fontSize={12} />
              <Tooltip formatter={(value: any) => Number(value).toFixed(3)} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#facc15"
                fill="#facc15"
                fillOpacity={0.2}
                dot={{ r: 3 }}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-2 text-sm text-gray-300">
          {paginatedHistory.map((entry, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-gray-400 font-mono text-xs">{entry.date}</span>
              <span className="text-white font-mono">{entry.score.toFixed(3)}</span>
            </div>
          ))}
        </div>

        {(hasPrev || hasNext) && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              disabled={!hasPrev}
              onClick={() => setHistoryPage((prev) => Math.max(prev - 1, 0))}
              className="px-3 py-1 text-xs text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
            >
              前へ
            </button>
            <button
              disabled={!hasNext}
              onClick={() => setHistoryPage((prev) => prev + 1)}
              className="px-3 py-1 text-xs text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
            >
              次へ
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
