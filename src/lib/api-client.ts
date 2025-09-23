"use client";

/** すべて相対で叩く。/api/* は next.config の rewrites でバックに中継 */
const API_PREFIX = "/api";

/** Cookieから値を取り出す（ブラウザ専用） */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const esc = name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1");
  const m = document.cookie.match(new RegExp(`(?:^|; )${esc}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

/** 相対パスを /api に付ける。絶対URLならそのまま */
function resolveUrl(input: string) {
  if (/^https?:\/\//i.test(input)) return input;         // 例外的に絶対URLが来たら通す
  return input.startsWith("/api/") ? input : `${API_PREFIX}${input.startsWith("/") ? "" : "/"}${input}`;
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
