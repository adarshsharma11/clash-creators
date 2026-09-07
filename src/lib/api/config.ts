export const API_PREFIX = "/api";

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

function trimLeadingSlashes(value: string): string {
  return value.replace(/^\/+/, "");
}

function readConfiguredApiOrigin(): string | undefined {
  const raw = (process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_BASE_API_URL)
    ?.trim()
    .replace(/^["']|["']$/g, "");
  return raw ? trimTrailingSlashes(raw) : undefined;
}

export function getApiBaseUrl(): string {
  const origin = readConfiguredApiOrigin();

  if (!origin) {
    throw new Error("NEXT_PUBLIC_API_URL or NEXT_BASE_API_URL is not set.");
  }

  return origin;
}

export function getApiUrl(): string {
  return `${getApiBaseUrl()}${API_PREFIX}`;
}

export const API_BASE_URL = readConfiguredApiOrigin() ?? "";

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
