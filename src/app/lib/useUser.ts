// app/lib/useUser.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useUser(sub: string | null) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sub) return;

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", sub)
        .single();

      if (error) {
        console.error("ユーザー取得エラー:", error);
      } else {
        setUser(data);
      }
      setLoading(false);
    };

    fetchUser();
  }, [sub]);

  return { user, loading };
}
