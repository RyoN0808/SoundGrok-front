"use client";

import { useEffect, useState } from "react";
import SongCard from "@/components/SongCard";
import ArtistCard from "@/components/ArtistCard";
import ScoreCircle from "@/components/ScoreCircle";
import SongDetail from "@/components/SongDetail";
import ArtistDetail from "@/components/ArtistDetail";
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

interface ArtistData {
  artistName: string;
  averageScore: number;
  songCount: number;
}

export default function MyPage() {
  const [songs, setSongs] = useState<SongData[]>([]);
  const [selected, setSelected] = useState<null | number>(null);
  const [artistSelected, setArtistSelected] = useState<null | number>(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<"default" | "score" | "playCount" | "name">("default");
  const [mode, setMode] = useState<"song" | "artist">("song");

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

  const totalPagesSong = Math.ceil(sortedSongs.length / pageSize);
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
    if (sortBy === "name") return a.artistName.localeCompare(b.artistName);
    if (sortBy === "score") return b.averageScore - a.averageScore;
    if (sortBy === "playCount") return b.songCount - a.songCount;
    return 0;
  });

  const totalPagesArtist = Math.ceil(sortedArtistAverages.length / pageSize);
  const pagedArtists = sortedArtistAverages.slice(page * pageSize, (page + 1) * pageSize);

  const displayedData = mode === "song" ? pagedSongs : pagedArtists;

  return (
    <main className="min-h-screen relative text-white px-4 py-10 bg-black overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-2xl animate-ping delay-500" />
        <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-yellow-300/10 rotate-45 blur-xl animate-spin-slow" />
      </div>

      <h1 className="relative z-10 text-center text-4xl font-extrabold tracking-wider bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)] mb-8">
        SCOREs
      </h1>

      <div className="relative z-10 flex justify-center mb-6">
        <ScoreCircle averageScore={84} />
      </div>

      {/* モード切替 */}
      <div className="relative z-10 flex justify-center mb-4 gap-4">
        {(["song", "artist"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setPage(0); // ページリセット
            }}
            className={`px-4 py-1 rounded ${mode === m ? "bg-yellow-600/40" : "bg-white/10 hover:bg-white/20"}`}
          >
            {m === "song" ? "曲" : "歌手"}
          </button>
        ))}
      </div>

      {/* ソート切替 */}
      <div className="relative z-10 flex justify-center mb-6 gap-4">
        {(["default", "score", "playCount", "name"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-3 py-1 rounded ${sortBy === s ? "bg-yellow-600/40" : "bg-white/10 hover:bg-white/20"}`}
          >
            {s === "default" ? "新着" : s === "score" ? "スコア" : s === "playCount" ? "歌唱回数" : "名前"}
          </button>
        ))}
      </div>

      {/* 表示 */}
      <motion.div
        key={page + sortBy + mode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center"
      >
        {displayedData.map((data, idx) => (
          <div
            key={idx}
            onClick={() =>
              mode === "song"
                ? setSelected(page * pageSize + idx)
                : setArtistSelected(page * pageSize + idx)
            }
          >
            {mode === "song" ? (
              <SongCard {...(data as SongData)} />
            ) : (
              <ArtistCard
                artistName={(data as ArtistData).artistName}
                averageScore={(data as ArtistData).averageScore}
                songCount={(data as ArtistData).songCount}
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* ページネーション */}
      {mode === "song" && (
        <div className="relative z-10 flex justify-center mt-8 gap-4">
          <button
            disabled={page === 0}
            className="px-4 py-1 text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          >
            前へ
          </button>
          <button
            disabled={page + 1 >= totalPagesSong}
            className="px-4 py-1 text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPagesSong - 1))}
          >
            次へ
          </button>
        </div>
      )}

      {mode === "artist" && (
        <div className="relative z-10 flex justify-center mt-8 gap-4">
          <button
            disabled={page === 0}
            className="px-4 py-1 text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          >
            前へ
          </button>
          <button
            disabled={page + 1 >= totalPagesArtist}
            className="px-4 py-1 text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPagesArtist - 1))}
          >
            次へ
          </button>
        </div>
      )}

      {/* モーダル */}
      {selected !== null && (
        <SongDetail
          isOpen={true}
          onClose={() => setSelected(null)}
          highestScore={Math.max(...songs[selected].lastScores.map((e) => e.score))}
          {...songs[selected]}
        />
      )}

      {artistSelected !== null && (
        <ArtistDetail
          isOpen={true}
          onClose={() => setArtistSelected(null)}
          {...sortedArtistAverages[artistSelected]}
          songs={songs} 
        />
      )}
    </main>
  );
}
