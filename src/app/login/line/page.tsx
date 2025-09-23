"use client";

import { useEffect } from "react";

export default function LineLogin() {
  useEffect(() => {
    // 次に戻したいパス（必要なら / などに変更）
    const next = "/mypage";
    // ここでは相対パスでOK（next.config.js の rewrites で Render へ中継）
    window.location.href = `/api/auth/login?next=${encodeURIComponent(next)}`;
  }, []);

  return <p>LINEログインにリダイレクト中...</p>;
}
