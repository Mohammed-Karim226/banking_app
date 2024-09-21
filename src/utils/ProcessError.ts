import { TErrorResponse } from "../types/index";

export function processError(err: unknown): TErrorResponse {
  const error = err as TErrorResponse;

  if (!error.message) {
    error.message = "An unknown error occurred";
  }
  if (!error.code) {
    error.code = 0;
  }

  return error;
}
