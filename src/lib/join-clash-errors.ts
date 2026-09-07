import { ApiError } from "@/types/api";

export function getJoinClashErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Unable to join this clash right now.";
  }

  if (error.status === 401) {
    return "Sign in with a creator account to join a clash.";
  }

  if (error.status === 404) {
    return "This clash was not found, or it is no longer available.";
  }

  if (error.status === 409) {
    return "You have already joined this clash.";
  }

  if (error.status === 422) {
    return "Some of the submitted values are invalid.";
  }

  if (error.status === 0) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  if (error.status >= 500) {
    return "The server is unavailable right now.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("creator profile")) {
    return "A creator profile is required to join a clash.";
  }

  if (message.includes("only active creators")) {
    return "Only active creators can join clashes.";
  }

  if (message.includes("already joined")) {
    return "You have already joined this clash.";
  }

  if (message.includes("only join upcoming") || message.includes("already ended") || message.includes("clash is full")) {
    return error.message;
  }

  if (error.status === 403) {
    return error.message || "You can't join this clash right now.";
  }

  return error.message || "Unable to join this clash right now.";
}
