import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/constants/auth";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export function json_ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function json_error(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
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
