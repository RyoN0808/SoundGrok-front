"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";

interface ArtistDetailProps {
  isOpen: boolean;
  onClose: () => void;
  artistName: string;
  averageScore: number;
  songCount: number;
  songs?: {
    artistName: string;
    songName: string;
    lastScores: { date: string; score: number }[];
  }[];
}

export default function ArtistDetail({
  isOpen,
  onClose,
  artistName,
  averageScore,
  songCount,
  songs,
}: ArtistDetailProps) {
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const history = useMemo(() => {
    if (!songs) return [];

    return songs
      .filter((s) => s.artistName === artistName)
      .flatMap((s) =>
        s.lastScores.map((entry) => ({
          date: entry.date,
          songName: s.songName,
          score: entry.score,
        }))
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [songs, artistName]);

  const paginated = history.slice(page * pageSize, (page + 1) * pageSize);
  const hasNext = (page + 1) * pageSize < history.length;
  const hasPrev = page > 0;

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
            {artistName}
          </DialogTitle>
        </DialogHeader>

        <div className="text-white text-sm space-y-1">
          <p>
            平均スコア:{" "}
            <span className="font-mono text-yellow-300">
              {averageScore.toFixed(3)}
            </span>
          </p>
          <p>登録曲数: ×{songCount}</p>
        </div>

        <div className="mt-6 space-y-2 text-sm text-gray-300">
          <div className="text-xs text-gray-500 mb-1 flex justify-between px-2">
            <span>日付</span>
            <span>曲名</span>
            <span>スコア</span>
          </div>
          {paginated.map((entry, idx) => (
            <div key={idx} className="flex justify-between px-2">
              <span className="font-mono text-gray-400 text-xs w-[30%]">
                {entry.date}
              </span>
              <span className="font-mono text-white text-xs w-[40%] truncate">
                {entry.songName}
              </span>
              <span className="font-mono text-yellow-300 text-xs w-[20%] text-right">
                {entry.score.toFixed(3)}
              </span>
            </div>
          ))}
        </div>

        {(hasPrev || hasNext) && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              disabled={!hasPrev}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              className="px-3 py-1 text-xs text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
            >
              前へ
            </button>
            <button
              disabled={!hasNext}
              onClick={() => setPage((prev) => prev + 1)}
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
