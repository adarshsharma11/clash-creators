export const API_PREFIX = "/api";
export const API_BROWSER_PROXY = "/backend";

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

function trimLeadingSlashes(value: string): string {
  return value.replace(/^\/+/, "");
}

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!raw) {
    throw new Error("NEXT_PUBLIC_API_URL is not set.");
  }

  return trimTrailingSlashes(raw);
}

export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    return `${API_BROWSER_PROXY}${API_PREFIX}`;
  }

  return `${getApiBaseUrl()}${API_PREFIX}`;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? trimTrailingSlashes(process.env.NEXT_PUBLIC_API_URL.trim())
  : "";

export const API_URL = API_BASE_URL ? `${API_BASE_URL}${API_PREFIX}` : "";

export function buildApiUrl(path: string): string {
  const origin = getApiUrl();
  const normalized = trimLeadingSlashes(path).replace(/^api(?:\/+|$)/i, "");

  if (!normalized) {
    return origin;
  }

  return `${origin}/${normalized}`;
}

export function toSearchParams(
  query: Record<string, string | number | boolean | undefined | null>
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    params.set(key, String(value));
  }

  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
}
