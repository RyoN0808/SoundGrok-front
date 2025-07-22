// src/app/page.tsx
"use client";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-neutral-800 text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">
        カラオケスコア管理Bot🎤
      </h1>
      <p className="text-lg sm:text-xl mb-8 text-center max-w-xl">
        あなたのカラオケスコアをLINEで記録・管理！  
        友だち登録して、最高のスコアを残そう！
      </p>

      {/* LINE友だち追加ボタン（公式バナー） */}
      <a
        href="https://line.me/R/ti/p/あなたのLINEアカウントID" // ←ここ変更
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"
          alt="友だち追加"
          className="w-48 hover:scale-105 transition-transform duration-300"
        />
      </a>

      {/* 任意でLINEログイン導線も */}
      <a
        href="/login/line"
        className="mt-6 text-blue-400 underline hover:text-blue-300"
      >
        LINEログインはこちら →
      </a>
    </main>
  );
}
