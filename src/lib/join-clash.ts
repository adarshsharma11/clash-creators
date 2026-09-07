export function normalizeJoinUsername(value: string): string {
  return value.trim().replace(/^@+/, "");
}
