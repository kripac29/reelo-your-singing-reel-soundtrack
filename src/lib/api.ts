export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "https://reelo-your-singing-reel-soundtrack.onrender.com/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getStoredToken(): string | null {
  return typeof window === "undefined" ? null : window.localStorage.getItem("token");
}

export function authHeaders(): Record<string, string> {
  const token = getStoredToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const hasBody = init.body !== undefined && init.body !== null;

  if (hasBody && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const token = getStoredToken();
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);

  try {
    return await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError("Unable to reach Reelo. Please try again.", 0);
  }
}

export async function getApiError(response: Response, fallback: string): Promise<ApiError> {
  const payload = await response.json().catch(() => null);
  const message =
    typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
      ? payload.message
      : typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : fallback;
  return new ApiError(message, response.status);
}
