"use client";

/**
 * バックエンドのベースURL
 * 例: NEXT_PUBLIC_API_URL=https://karaoke-linebot.onrender.com
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://karaoke-linebot.onrender.com";

/** Cookieから値を取り出す（ブラウザ専用） */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  // name を正規表現用にエスケープしてから検索
  const esc = name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1");
  const m = document.cookie.match(new RegExp(`(?:^|; )${esc}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

/** 相対パスなら API_BASE を付与、絶対URLならそのまま */
function resolveUrl(input: string) {
  if (/^https?:\/\//i.test(input)) return input;
  // API_BASE の末尾/ と input の先頭/ が二重にならないよう調整
  const base = API_BASE.replace(/\/+$/, "");
  const path = input.startsWith("/") ? input : `/${input}`;
  return `${base}${path}`;
}

/** CSRFヘッダ(X-CSRF-Token)を必要時だけ自動付与した fetch */
export async function apiFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = resolveUrl(input);

  const method = (init.method || "GET").toUpperCase();
  const needsCsrf = !["GET", "HEAD", "OPTIONS"].includes(method);

  const headers = new Headers(init.headers || {});
  if (needsCsrf && !headers.has("X-CSRF-Token")) {
    const csrf = getCookie("sg_csrf") ?? "";
    headers.set("X-CSRF-Token", csrf);
  }

  // body があるのに Content-Type が無い場合だけ JSON を付ける
  if (init.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...init,
    credentials: "include", // セッションクッキー送信
    headers,
  });
}

/** JSONを返すGETの薄いラッパ */
export async function apiGetJSON<T = any>(path: string): Promise<T> {
  const res = await apiFetch(path, { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

/** JSONを送る変更系ヘルパ */
export async function apiSendJSON<T = any>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  const res = await apiFetch(path, {
    method,
    body: body == null ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${method} ${path} failed: ${res.status} ${text}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json")
    ? ((await res.json()) as T)
    : (undefined as T);
}
