export type AuthScope = "admin" | "user";

type UnauthorizedListener = (scope: AuthScope) => void;

const listeners = new Set<UnauthorizedListener>();

export function subscribeUnauthorized(listener: UnauthorizedListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyUnauthorized(scope: AuthScope): void {
  listeners.forEach((listener) => {
    listener(scope);
  });
}

export function scopeFromPath(path: string): AuthScope {
  return path.startsWith("/admin") ? "admin" : "user";
}
