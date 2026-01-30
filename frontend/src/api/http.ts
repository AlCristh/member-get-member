import { getToken } from "./authToken";

const BASE_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

type ApiError = {
  message?: string;
  error?: string;
};

function isPublicPath(path: string) {
  // tudo que é público no backend
  return path.startsWith("/auth/") || path === "/health";
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers = new Headers(init.headers);

  // Só seta Content-Type se tiver body (evita problemas em GET e preflight)
  const hasBody = init.body !== undefined && init.body !== null;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // ✅ NÃO manda Authorization em endpoints públicos
  if (token && !isPublicPath(path) && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const err = (data ?? {}) as ApiError;
    const msg = err.message || err.error || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
