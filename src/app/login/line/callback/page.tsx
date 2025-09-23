"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LineCallbackContent() {
  const router = useRouter();

  useEffect(() => {
    // コールバック処理はバックエンドが済ませる想定なので、そのままマイページへ
    router.replace("/mypage");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <p>ログイン処理中...</p>
    </div>
  );
}
