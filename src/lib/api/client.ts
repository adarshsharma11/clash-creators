import { buildApiUrl } from "@/lib/api/config";
import { notifyUnauthorized, scopeFromPath } from "@/lib/api/session-events";
import {
  ApiError,
  type ApiSuccessResponse,
  type PaginationMeta,
  type PaginatedResult,
} from "@/types/api";

type RequestOptions = {
  signal?: AbortSignal;
  headers?: HeadersInit;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSuccessEnvelope<T>(value: unknown): value is ApiSuccessResponse<T> {
  return isRecord(value) && value.success === true;
}

function isInternalErrorMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("prisma") ||
    normalized.includes("sql") ||
    normalized.includes("econnrefused") ||
    normalized.includes("stack") ||
    normalized.includes("at object.")
  );
}

function readPayloadMessage(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }

  if (isRecord(payload.error)) {
    const message = payload.error.message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  return null;
}

function readErrorCode(payload: unknown): string | null {
  if (!isRecord(payload) || !isRecord(payload.error)) {
    return null;
  }

  return typeof payload.error.code === "string" ? payload.error.code : null;
}

function readErrorList(payload: unknown): string[] {
  if (!isRecord(payload) || !isRecord(payload.error) || !Array.isArray(payload.error.errors)) {
    return [];
  }

  return payload.error.errors.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function shouldNotifyUnauthorized(path: string): boolean {
  const normalized = path.split("?")[0];
  return ![
    "/auth/me",
    "/auth/login",
    "/auth/signup",
    "/auth/logout",
    "/admin/me",
    "/admin/login",
    "/admin/logout",
  ].includes(normalized);
}

function readErrorMessage(payload: unknown, status: number): string {
  if (status === 401) {
    const payloadMessage = readPayloadMessage(payload);
    if (payloadMessage && !isInternalErrorMessage(payloadMessage)) {
      if (payloadMessage === "Invalid credentials" || payloadMessage === "Invalid admin credentials") {
        return "Invalid credentials.";
      }
    }
    return "Your session has expired. Please sign in again.";
  }

  const payloadMessage = readPayloadMessage(payload);

  if (payloadMessage && !isInternalErrorMessage(payloadMessage)) {
    if (payloadMessage === "Invalid admin credentials" || payloadMessage === "Credentials Error") {
      return "Invalid credentials.";
    }
    if (
      payloadMessage === "Admin authentication required" ||
      payloadMessage === "Unauthorized - you need to login"
    ) {
      return "Your session has expired. Please sign in again.";
    }
    return payloadMessage;
  }

  if (status === 403) {
    return "You don't have permission to perform this action.";
  }

  if (status === 404) {
    return "The requested resource was not found.";
  }

  if (status === 409) {
    return "This action conflicts with existing data.";
  }

  if (status === 422) {
    return "Some of the submitted values are invalid.";
  }

  if (status === 429) {
    return "Too many requests. Please wait and try again.";
  }

  if (status >= 500) {
    return "The server is unavailable right now.";
  }

  if (status === 0) {
    return "Unable to reach the server.";
  }

  return "Unable to load data right now.";
}

function errorCodeForStatus(status: number): string {
  if (status === 401) {
    return "UNAUTHORIZED";
  }
  if (status === 403) {
    return "FORBIDDEN";
  }
  if (status === 404) {
    return "NOT_FOUND";
  }
  if (status === 409) {
    return "CONFLICT";
  }
  if (status === 422) {
    return "VALIDATION_ERROR";
  }
  if (status === 429) {
    return "RATE_LIMITED";
  }
  if (status === 0) {
    return "NETWORK_ERROR";
  }
  if (status >= 500) {
    return "SERVER_ERROR";
  }
  return "HTTP_ERROR";
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError("The server returned an unexpected response.", response.status, "INVALID_JSON");
  }
}

function unwrapData<T>(payload: unknown, status: number): T {
  if (isSuccessEnvelope<T>(payload)) {
    if ("data" in payload) {
      return payload.data;
    }

    return undefined as T;
  }

  if (isRecord(payload) && payload.success === false) {
    throw new ApiError(readErrorMessage(payload, status), status, errorCodeForStatus(status));
  }

  throw new ApiError("The server returned an unexpected response.", status, "INVALID_RESPONSE");
}

function unwrapPaginated<T>(payload: unknown, status: number): PaginatedResult<T> {
  if (isSuccessEnvelope<T[]>(payload) && payload.pagination) {
    return {
      items: payload.data,
      pagination: payload.pagination,
    };
  }

  throw new ApiError("The server returned an unexpected response.", status, "INVALID_RESPONSE");
}

function isPaginationMeta(value: unknown): value is PaginationMeta {
  return (
    isRecord(value) &&
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.total === "number" &&
    typeof value.totalPages === "number"
  );
}

async function request<T>(
  path: string,
  init: RequestInit,
  options: RequestOptions = {},
  mode: "data" | "paginated" = "data"
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildApiUrl(path), {
      ...init,
      credentials: "include",
      signal: options.signal,
      headers: {
        Accept: "application/json",
        ...init.headers,
        ...options.headers,
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError("Unable to reach the server.", 0, "NETWORK_ERROR");
  }

  const payload = await parseJson(response);

  if (!response.ok) {
    if (response.status === 401 && shouldNotifyUnauthorized(path)) {
      notifyUnauthorized(scopeFromPath(path));
    }

    throw new ApiError(
      readErrorMessage(payload, response.status),
      response.status,
      readErrorCode(payload) ?? errorCodeForStatus(response.status),
      readErrorList(payload)
    );
  }

  if (mode === "paginated") {
    if (isSuccessEnvelope<unknown>(payload) && isPaginationMeta(payload.pagination)) {
      return unwrapPaginated(payload, response.status) as T;
    }

    throw new ApiError("The server returned an unexpected response.", response.status, "INVALID_RESPONSE");
  }

  return unwrapData<T>(payload, response.status);
}

function jsonInit(method: string, body?: unknown): RequestInit {
  return {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}

export const apiClient = {
  get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(path, { method: "GET" }, options);
  },
  getPaginated<T>(path: string, options: RequestOptions = {}): Promise<PaginatedResult<T>> {
    return request<PaginatedResult<T>>(path, { method: "GET" }, options, "paginated");
  },
  post<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>(path, jsonInit("POST", body), options);
  },
  put<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>(path, jsonInit("PUT", body), options);
  },
  patch<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>(path, jsonInit("PATCH", body), options);
  },
  delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(path, { method: "DELETE" }, options);
  },
};
