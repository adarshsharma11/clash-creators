import { ApiError } from "@/types/api";

export function retryUnlessNotFound(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && (error.status === 404 || error.status === 401 || error.status === 403)) {
    return false;
  }

  return failureCount < 1;
}
