"use client";

import { useEffect, useState } from "react";
import SongCard from "@/components/SongCard";
import ScoreCircle from "@/components/ScoreCircle";
import SongDetail from "@/components/SongDetail";
import { motion } from "framer-motion";

interface ScoreEntry {
  date: string;
  score: number;
}

interface SongData {
  songName: string;
  artistName: string;
  averageScore: number;
  playCount: number;
  genre: string;
  genreIcon: string;
  lastScores: ScoreEntry[];
}

export default function MyPage() {
  const [songs, setSongs] = useState<SongData[]>([]);
  const [selected, setSelected] = useState<null | number>(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<"default" | "score" | "playCount">("default");
  const [artistSortKey, setArtistSortKey] = useState<"created" | "name" | "score">("created");
  const [artistSortOrder, setArtistSortOrder] = useState<"asc" | "desc">("desc");

  const pageSize = 4;

  useEffect(() => {
    const dummySongs = [...Array(23)].map((_, i) => {
      const lastScores = [...Array(Math.floor(Math.random() * 15) + 5)].map((_, j) => ({
        date: `2025-05-${String(j + 1).padStart(2, "0")}`,
        score: 70 + Math.random() * 30,
      })).sort((a, b) => b.date.localeCompare(a.date));

      return {
        songName: `Song ${i + 1}`,
        artistName: `Artist ${i % 5 + 1}`,
        averageScore: 75 + Math.random() * 25,
        playCount: Math.floor(Math.random() * 10) + 1,
        genre: ["POP", "ROCK", "アニメ"][i % 3],
        genreIcon: ["🎵", "🎸", "📺"][i % 3],
        lastScores,
      };
    });

    setSongs(dummySongs);
  }, []);

  const sortedSongs = [...songs].sort((a, b) => {
    if (sortBy === "score") return b.averageScore - a.averageScore;
    if (sortBy === "playCount") return b.playCount - a.playCount;
    return 0;
  });

  const totalPages = Math.ceil(sortedSongs.length / pageSize);
  const pagedSongs = sortedSongs.slice(page * pageSize, (page + 1) * pageSize);

  const artistSummary = songs.reduce((acc, song) => {
    const existing = acc.find((a) => a.artistName === song.artistName);
    if (existing) {
      existing.totalScore += song.averageScore;
      existing.songCount += 1;
    } else {
      acc.push({
        artistName: song.artistName,
        totalScore: song.averageScore,
        songCount: 1,
      });
    }
    return acc;
  }, [] as { artistName: string; totalScore: number; songCount: number }[]);

  const artistAverages = artistSummary.map((a) => ({
    artistName: a.artistName,
    averageScore: a.totalScore / a.songCount,
    songCount: a.songCount,
  }));

  const sortedArtistAverages = [...artistAverages].sort((a, b) => {
    const factor = artistSortOrder === "asc" ? 1 : -1;
    if (artistSortKey === "name") {
      return factor * a.artistName.localeCompare(b.artistName);
    } else if (artistSortKey === "score") {
      return factor * (a.averageScore - b.averageScore);
    } else {
      return factor * (songs.findIndex(s => s.artistName === a.artistName) - songs.findIndex(s => s.artistName === b.artistName));
    }
  }).slice(0, 4);

  return (
    <main className="min-h-screen relative text-white px-4 py-10 bg-gradient-to-br from-black via-neutral-900 to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/10 via-black/60 to-black opacity-30 blur-2xl pointer-events-none z-0" />

      <h1 className="relative z-10 text-center text-4xl font-extrabold tracking-wider bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)] mb-8">
        SCOREs
      </h1>

      <div className="relative z-10 flex justify-center mb-6">
        <ScoreCircle averageScore={84} />
      </div>

      <div className="relative z-10 mb-10">
        <h2 className="text-xl font-bold text-yellow-300 mb-4">歌手別 平均スコア</h2>

        <div className="flex justify-center gap-2 mb-4 text-sm">
          <button onClick={() => setArtistSortKey("created")} className={`px-3 py-1 rounded ${artistSortKey === "created" ? "bg-yellow-600/40" : "bg-white/10 hover:bg-white/20"}`}>登録順</button>
          <button onClick={() => setArtistSortKey("name")} className={`px-3 py-1 rounded ${artistSortKey === "name" ? "bg-yellow-600/40" : "bg-white/10 hover:bg-white/20"}`}>名前順</button>
          <button onClick={() => setArtistSortKey("score")} className={`px-3 py-1 rounded ${artistSortKey === "score" ? "bg-yellow-600/40" : "bg-white/10 hover:bg-white/20"}`}>スコア順</button>
          <button onClick={() => setArtistSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">
            {artistSortOrder === "asc" ? "昇順" : "降順"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          {sortedArtistAverages.map((artist, idx) => (
            <SongCard
              key={idx}
              songName={"平均"}
              artistName={artist.artistName}
              averageScore={artist.averageScore}
              playCount={artist.songCount}
              genre={"平均"}
              genreIcon={"🎤"}
              lastScores={[]}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex justify-center gap-4 mb-8 text-sm">
        <button onClick={() => setSortBy("default")} className={`px-3 py-1 rounded ${sortBy === "default" ? "bg-yellow-600/40" : "bg-white/10 hover:bg-white/20"}`}>新着</button>
        <button onClick={() => setSortBy("score")} className={`px-3 py-1 rounded ${sortBy === "score" ? "bg-yellow-600/40" : "bg-white/10 hover:bg-white/20"}`}>スコア</button>
        <button onClick={() => setSortBy("playCount")} className={`px-3 py-1 rounded ${sortBy === "playCount" ? "bg-yellow-600/40" : "bg-white/10 hover:bg-white/20"}`}>歌唱回数</button>
      </div>

      <motion.div
        key={page + sortBy}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center"
      >
        {pagedSongs.map((song, idx) => (
          <div key={idx} onClick={() => setSelected(page * pageSize + idx)}>
            <SongCard {...song} />
          </div>
        ))}
      </motion.div>

      <div className="relative z-10 flex justify-center mt-8 gap-4">
        <button
          disabled={page === 0}
          className="px-4 py-1 text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        >
          前へ
        </button>
        <button
          disabled={page + 1 >= totalPages}
          className="px-4 py-1 text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
        >
          次へ
        </button>
      </div>

      {selected !== null && (
        <SongDetail
          isOpen={true}
          onClose={() => setSelected(null)}
          highestScore={Math.max(...songs[selected].lastScores.map((e) => e.score))}
          {...songs[selected]}
        />
      )}
    </main>
  );
}
