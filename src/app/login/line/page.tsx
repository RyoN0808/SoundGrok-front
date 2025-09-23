"use client";

import { useEffect } from "react";
import { API_BASE } from "@/lib/api-client";

export default function LineLogin() {
  useEffect(() => {
    // ここでLINEのauthorize URLは作らない！
    // サーバに任せる（next はログイン後に戻したいパス）
    const next = "/mypage";
    window.location.href = `${API_BASE}/auth/login?next=${encodeURIComponent(next)}`;
  }, []);

  return <p>LINEログインにリダイレクト中...</p>;
}
