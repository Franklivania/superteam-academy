import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/constants/auth";
import { status_from_http, type ApiResponse } from "@/lib/types/api-contract";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export function api_success<T>(data: T, message: string, status_code = 200): NextResponse {
  const body: ApiResponse<T> = {
    success: true,
    status: status_from_http(status_code),
    message,
    data,
  };
  return NextResponse.json(body, { status: status_code });
}

export function api_error(message: string, status_code = 400): NextResponse {
  const body: ApiResponse<null> = {
    success: false,
    status: status_from_http(status_code),
    message,
    data: null,
  };
  return NextResponse.json(body, { status: status_code });
}

/** @deprecated Use api_success / api_error for contract compliance. */
export function json_ok<T>(data: T, status = 200): NextResponse {
  return api_success(data, "OK", status);
}

/** @deprecated Use api_error for contract compliance. */
export function json_error(message: string, status = 400): NextResponse {
  return api_error(message, status);
}

export function set_session_cookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export function clear_session_cookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
