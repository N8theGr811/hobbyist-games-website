/** Choose a default language at the host, while explicit links and choices stay usable. */
import { NextResponse, type NextRequest } from "next/server";
import { isLocale, LANGUAGE_COOKIE, LANGUAGE_QUERY, localePath, PAGE_PATHS } from "./lib/locales";

export function proxy(request: NextRequest): NextResponse {
  const { pathname, search, searchParams } = request.nextUrl;
  const unprefixed = pathname.replace(/^\/pt-BR(?=\/|$)/, "") || "/";
  if (!PAGE_PATHS.includes(unprefixed) || !["GET", "HEAD"].includes(request.method)) {
    return NextResponse.next();
  }

  const selected = searchParams.get(LANGUAGE_QUERY);
  const preference = request.cookies.get(LANGUAGE_COOKIE)?.value;
  const explicitChoice = selected !== null && isLocale(selected);
  const locale = explicitChoice ? selected
    : pathname !== unprefixed ? "pt-BR"
    : preference !== undefined && isLocale(preference) ? preference
    : request.headers.get("x-vercel-ip-country") === "BR" ? "pt-BR" : "en";
  const destination = localePath(unprefixed, locale);
  const response = destination !== pathname
    ? NextResponse.redirect(new URL(destination + search, request.url), 307)
    : NextResponse.next();

  // Country and cookie decisions must not be reused for another visitor.
  if (pathname === unprefixed || explicitChoice) {
    response.headers.set("Cache-Control", "private, no-store");
  }
  const speculative = /prefetch/i.test([
    request.headers.get("purpose"), request.headers.get("sec-purpose"),
  ].join(" "));
  const fetchDestination = request.headers.get("sec-fetch-dest");
  if (explicitChoice && preference !== selected && request.method === "GET" && !speculative &&
      (!fetchDestination || fetchDestination === "document")) {
    response.cookies.set(LANGUAGE_COOKIE, selected, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
  }
  return response;
}

export const config = {
  // Static matcher skips APIs and files; PAGE_PATHS above is the page allowlist.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
