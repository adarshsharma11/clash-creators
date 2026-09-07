export type SharePayload = {
  url: string;
  title: string;
  text: string;
};

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  if (typeof window === "undefined") {
    return pathOrUrl;
  }

  return new URL(pathOrUrl, window.location.origin).toString();
}

export async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export async function shareOrCopy(payload: SharePayload): Promise<ShareOutcome> {
  const url = toAbsoluteUrl(payload.url);

  if (navigator.share) {
    try {
      await navigator.share({
        title: payload.title,
        text: payload.text,
        url,
      });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  const copied = await copyText(url);
  return copied ? "copied" : "failed";
}
