"use client";

import { API_BASE, apiFetch, apiGetJSON } from "./api-client";

export type Me = { authenticated: boolean; user_id?: string };

/** /auth/me で認証状態を取得 */
export async function getMe(): Promise<Me> {
  try {
    return await apiGetJSON<Me>("/auth/me");
  } catch {
    return { authenticated: false };
  }
}

/** 未ログインならサーバーの /auth/login に飛ばす */
export function redirectToLogin(next?: string) {
  const n =
    next ??
    (typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/");
  window.location.href = `${API_BASE}/auth/login?next=${encodeURIComponent(n)}`;
}

/** 強制的にログイン確認して user_id を返す（未ログインは即リダイレクト） */
export async function requireAuth(): Promise<string> {
  const me = await getMe();
  if (!me.authenticated || !me.user_id) {
    redirectToLogin();
    throw new Error("Not authenticated");
  }
  return me.user_id;
}

/** ログアウト（POST + CSRF） */
export async function logout(): Promise<boolean> {
  try {
    const res = await apiFetch("/auth/logout", { method: "POST" });
    return res.ok;
  } catch {
    return false;
  }
}
