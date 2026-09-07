export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export function formatPoints(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

const COUNTRY_LABELS: Record<string, string> = {
  US: "🇺🇸 United States",
  UK: "🇬🇧 United Kingdom",
  CA: "🇨🇦 Canada",
  DE: "🇩🇪 Germany",
  FR: "🇫🇷 France",
  IT: "🇮🇹 Italy",
  ES: "🇪🇸 Spain",
  AU: "🇦🇺 Australia",
  JP: "🇯🇵 Japan",
  KR: "🇰🇷 South Korea",
  BR: "🇧🇷 Brazil",
  MX: "🇲🇽 Mexico",
};

export function formatCountry(code: string): string {
  return COUNTRY_LABELS[code] ?? code;
}

export function formatCountdown(time: {
  hours: number;
  minutes: number;
  seconds: number;
}): string {
  return [time.hours, time.minutes, time.seconds]
    .map((unit) => unit.toString().padStart(2, "0"))
    .join(":");
}
