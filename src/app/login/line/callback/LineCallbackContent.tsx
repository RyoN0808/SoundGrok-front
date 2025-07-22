"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LineCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      console.error("認可コードが見つかりませんでした");
      return;
    }

    const usedCode = sessionStorage.getItem("used_line_code");
    if (usedCode === code) {
      console.warn("この認可コードはすでに使用済みです。処理をスキップします。");
      return;
    }
    sessionStorage.setItem("used_line_code", code);

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/line/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("サーバーエラー:", errorText);
          throw new Error("サーバーエラー");
        }

        const data = await res.json();

        if (data.sub) {
          localStorage.setItem("line_sub", data.sub);
          router.push("/mypage");
        } else {
          console.error("subが返却されませんでした", data);
        }
      } catch (err) {
        console.error("ログイン処理中にエラーが発生しました", err);
      }
    };

    fetchData();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <p>ログイン処理中...</p>
    </div>
  );
}
