'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import SongCard from '@/components/SongCard'
import ArtistCard from '@/components/ArtistCard'
import SongDetail from '@/components/SongDetail'
import ArtistDetail from '@/components/ArtistDetail'
import ScoreCircle from '@/components/ScoreCircle'
import { motion } from 'framer-motion'
import { requireAuth, logout } from '@/lib/auth'   // ★ 修正済み

interface ScoreEntry {
  date: string
  score: number
}

interface SongData {
  songName: string
  artistName: string
  averageScore: number
  playCount: number
  genre: string
  genreIcon: string
  lastScores: ScoreEntry[]
}

interface ArtistData {
  artistName: string
  averageScore: number
  songCount: number
}

interface SupabaseUser {
  id: string
  average_score: number
}

export default function MyPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [songs, setSongs] = useState<SongData[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [artistSelected, setArtistSelected] = useState<number | null>(null)
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState<'default' | 'score' | 'playCount' | 'name'>('default')
  const [mode, setMode] = useState<'song' | 'artist'>('song')
  const pageSize = 4

  // ログイン確認
  useEffect(() => {
    (async () => {
      try {
        const uid = await requireAuth()   // 未ログインなら /auth/login にリダイレクト
        setUserId(uid)
      } catch {
        // redirectToLogin 内で飛ばされるのでここでは何もしない
      }
    })()
  }, [])

  // ユーザー情報取得
  useEffect(() => {
    if (!userId) return

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, average_score')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('ユーザー取得エラー', error)
        return
      }

      if (data) setUser(data)
    }

    fetchUser()
  }, [userId])

  // スコア取得
  useEffect(() => {
    if (!user) return

    const fetchScores = async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('スコア取得エラー', error)
        return
      }

      if (!data) return

      const grouped = data.reduce((acc: Record<string, ScoreEntry[]>, curr) => {
        const key = `${curr.song_name}|${curr.artist_name}`
        if (!acc[key]) acc[key] = []
        acc[key].push({ score: curr.score, date: curr.created_at })
        return acc
      }, {})

      const processedSongs: SongData[] = Object.entries(grouped).map(([key, scores]) => {
        const [songName, artistName] = key.split('|')
        const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length
        const lastScores = [...scores].sort((a, b) => b.date.localeCompare(a.date))

        return {
          songName,
          artistName,
          averageScore,
          playCount: scores.length,
          genre: '未分類',
          genreIcon: '🎵',
          lastScores,
        }
      })

      setSongs(processedSongs)
    }

    fetchScores()
  }, [user])

  if (!user) return <div className="p-4 text-white">ユーザー情報が見つかりません</div>

  const sortedSongs = [...songs].sort((a, b) => {
    if (sortBy === 'score') return b.averageScore - a.averageScore
    if (sortBy === 'playCount') return b.playCount - a.playCount
    return 0
  })

  const totalPagesSong = Math.ceil(sortedSongs.length / pageSize)
  const pagedSongs = sortedSongs.slice(page * pageSize, (page + 1) * pageSize)

  const artistSummary = songs.reduce((acc, song) => {
    const found = acc.find((a) => a.artistName === song.artistName)
    if (found) {
      found.totalScore += song.averageScore
      found.songCount += 1
    } else {
      acc.push({
        artistName: song.artistName,
        totalScore: song.averageScore,
        songCount: 1,
      })
    }
    return acc
  }, [] as { artistName: string; totalScore: number; songCount: number }[])

  const artistAverages: ArtistData[] = artistSummary.map((a) => ({
    artistName: a.artistName,
    averageScore: a.totalScore / a.songCount,
    songCount: a.songCount,
  }))

  const sortedArtists = [...artistAverages].sort((a, b) => {
    if (sortBy === 'score') return b.averageScore - a.averageScore
    if (sortBy === 'playCount') return b.songCount - a.songCount
    if (sortBy === 'name') return a.artistName.localeCompare(b.artistName)
    return 0
  })

  const totalPagesArtist = Math.ceil(sortedArtists.length / pageSize)
  const pagedArtists = sortedArtists.slice(page * pageSize, (page + 1) * pageSize)
  const displayedData = mode === 'song' ? pagedSongs : pagedArtists

  return (
    <main className="min-h-screen relative text-white px-4 py-10 bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-2xl animate-ping delay-500" />
        <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-yellow-300/10 rotate-45 blur-xl animate-spin-slow" />
      </div>

      <h1 className="relative z-10 text-center text-4xl font-extrabold tracking-wider bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)] mb-8">
        SCOREs
      </h1>

      {/* ログアウトボタン */}
      <div className="relative z-10 flex justify-center mb-6">
        <button
          onClick={async () => {
            const ok = await logout()
            if (ok) window.location.href = "/login"
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          ログアウト
        </button>
      </div>

      <div className="relative z-10 flex justify-center mb-6">
        <ScoreCircle averageScore={user.average_score ?? 0} />
      </div>

      <div className="relative z-10 flex justify-center mb-4 gap-4">
        {(['song', 'artist'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m)
              setPage(0)
            }}
            className={`px-4 py-1 rounded ${mode === m ? 'bg-yellow-600/40' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {m === 'song' ? '曲' : '歌手'}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex justify-center mb-6 gap-4">
        {(['default', 'score', 'playCount', 'name'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-3 py-1 rounded ${sortBy === s ? 'bg-yellow-600/40' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {s === 'default' ? '新着' : s === 'score' ? 'スコア' : s === 'playCount' ? '歌唱回数' : '名前'}
          </button>
        ))}
      </div>

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
              mode === 'song' ? setSelected(page * pageSize + idx) : setArtistSelected(page * pageSize + idx)
            }
          >
            {mode === 'song' ? (
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

      <div className="relative z-10 flex justify-center mt-8 gap-4">
        <button
          disabled={page === 0}
          className="px-4 py-1 text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        >
          前へ
        </button>
        <button
          disabled={
            (mode === 'song' && page + 1 >= totalPagesSong) ||
            (mode === 'artist' && page + 1 >= totalPagesArtist)
          }
          className="px-4 py-1 text-white rounded bg-white/10 hover:bg-white/20 disabled:opacity-30"
          onClick={() => setPage((prev) => prev + 1)}
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

      {artistSelected !== null && (
        <ArtistDetail
          isOpen={true}
          onClose={() => setArtistSelected(null)}
          {...sortedArtists[artistSelected]}
          songs={songs}
        />
      )}
    </main>
  )
}
