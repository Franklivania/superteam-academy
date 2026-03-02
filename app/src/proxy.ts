import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { is_auth_required } from "@/lib/constants/routes";
import { SESSION_COOKIE_NAME } from "@/lib/constants/auth";

const intl_middleware = createMiddleware(routing);

export function proxy(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

  const pathname_without_locale = routing.locales.reduce(
    (path, locale) => path.replace(new RegExp(`^/${locale}(/|$)`), "/"),
    pathname,
  );

  if (is_auth_required(pathname_without_locale)) {
    const session = request.cookies.get(SESSION_COOKIE_NAME);
    if (!session?.value) {
      const locale = pathname.split("/")[1] ?? "";
      const locale_prefix = routing.locales.includes(locale as (typeof routing.locales)[number]) ? `/${locale}` : "";
      const login_url = new URL(`${locale_prefix}/login`, request.url);
      login_url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login_url);
    }
  }

  return intl_middleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
