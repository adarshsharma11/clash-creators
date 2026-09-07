import type { ClashListItem } from "@/types/clash";

export function mergeJoinableClashes(
  live: ClashListItem | null | undefined,
  upcoming: ClashListItem[]
): ClashListItem[] {
  const items: ClashListItem[] = [];
  const seen = new Set<string>();

  const push = (clash: ClashListItem | null | undefined) => {
    if (!clash || seen.has(clash.id)) {
      return;
    }
    seen.add(clash.id);
    items.push(clash);
  };

  push(live);
  upcoming.forEach(push);
  return items;
}

export function findClashByRef(clashes: ClashListItem[], ref?: string | null): ClashListItem | null {
  if (!ref) {
    return null;
  }

  return clashes.find((clash) => clash.id === ref || clash.slug === ref) ?? null;
}

export function participantLabel(count: number, max: number | null): string {
  if (max === null) {
    return `${count} ${count === 1 ? "creator" : "creators"}`;
  }

  return `${count} / ${max} creators`;
}

export function isObviouslyFull(clash: ClashListItem): boolean {
  return clash.maxParticipants !== null && clash.participantCount >= clash.maxParticipants;
}

export function isVisuallyClosed(clash: ClashListItem): boolean {
  return clash.status === "COMPLETED" || clash.status === "CANCELLED" || clash.status === "DRAFT";
}

export function isJoinableClash(clash: ClashListItem): boolean {
  return clash.status === "UPCOMING" && !isObviouslyFull(clash);
}

export function getReasonablyJoinableClashes(clashes: ClashListItem[]): ClashListItem[] {
  return clashes.filter(isJoinableClash);
}

export function resolveClashQueryRef(
  ref: string | null | undefined,
  live: ClashListItem | null | undefined
): string | null {
  if (!ref) {
    return null;
  }

  if (ref === "daily" || ref === "live") {
    return live?.id ?? live?.slug ?? null;
  }

  return ref;
}

export function clashPageHref(clash: { slug: string; id: string }): string {
  return `/clash/${clash.slug || clash.id}`;
}
