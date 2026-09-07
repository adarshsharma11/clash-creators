import { ApiError } from "@/types/api";

export function getJoinClashErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Something went wrong. Please try again.";
  }

  if (error.status === 401) {
    return "Creator joining is being finalized. Please try again shortly.";
  }

  if (error.status === 404) {
    return "This clash was not found, or it is no longer available.";
  }

  if (error.status === 409) {
    return "You're already participating in this clash.";
  }

  if (error.status === 0) {
    return "We couldn't join the clash. Please check your connection and try again.";
  }

  if (error.status >= 500) {
    return "Something went wrong. Please try again.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("already joined") || message.includes("already participating")) {
    return "You're already participating in this clash.";
  }

  if (message.includes("clash is full") || message.includes("this clash is full")) {
    return "This clash is full.";
  }

  if (
    message.includes("only join upcoming") ||
    message.includes("no longer accepting") ||
    message.includes("clash is closed") ||
    message.includes("not accepting")
  ) {
    return "This clash is no longer accepting participants.";
  }

  if (message.includes("already ended") || message.includes("completed")) {
    return "This clash has already ended.";
  }

  if (error.status === 422) {
    return "Some of the submitted values are invalid.";
  }

  if (error.status === 403) {
    return "This clash is no longer accepting participants.";
  }

  return "Something went wrong. Please try again.";
}

export function isAlreadyJoinedError(error: unknown): boolean {
  if (!(error instanceof ApiError)) {
    return false;
  }

  if (error.status === 409) {
    return true;
  }

  const message = error.message.toLowerCase();
  return message.includes("already joined") || message.includes("already participating");
}
