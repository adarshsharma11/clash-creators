export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
};

export type ApiFailureResponse = {
  success: false;
  error?: {
    message?: unknown;
    errors?: string[];
    code?: string;
  };
  message?: string;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly errors: string[];

  constructor(message: string, status = 0, code = "API_ERROR", errors: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return error.message || "Too many requests. Please wait and try again.";
    }

    if (error.message === "Validation Error" && error.errors.length > 0) {
      return error.errors[0];
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function getApiValidationErrors(error: unknown): string[] {
  if (error instanceof ApiError) {
    return error.errors;
  }

  return [];
}

export function getPermissionErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 403) {
    return "You don't have permission to perform this action.";
  }

  return getApiErrorMessage(error);
}
