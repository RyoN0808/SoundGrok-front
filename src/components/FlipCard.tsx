"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SongCard from "./SongCard";
import SongBack from "./SongBack";

type Props = {
  songName: string;
  artistName: string;
  averageScore: number;
  highestScore: number;
  playCount: number;
  genre: string;
  genreIcon: string;
};

export default function FlipCard({
  songName,
  artistName,
  averageScore,
  highestScore,
  playCount,
  genre,
  genreIcon,
}: Props) {
  const [flipped, setFlipped] = useState(false); // ←これ！

  return (
    <div
      className="relative w-40 sm:w-48 aspect-[3/4] cursor-pointer perspective"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="absolute w-full h-full transition-transform duration-500"
        animate={{ rotateY: flipped ? 180 : 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 表 */}
        <div className="absolute w-full h-full backface-hidden">
          <SongCard
            songName={songName}
            artistName={artistName}
            averageScore={averageScore}
            playCount={playCount}
            genre={genre}
            genreIcon={genreIcon}
          />
        </div>

        {/* 裏 */}
        <div className="absolute w-full h-full rotate-y-180 backface-hidden">
          <SongBack highestScore={highestScore} playCount={playCount} />
        </div>
      </motion.div>
    </div>
  );
}
