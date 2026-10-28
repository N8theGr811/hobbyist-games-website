#!/usr/bin/env python3
"""Exercise website locale routing through a running HTTP server, without JavaScript."""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from http.cookies import SimpleCookie
from http.cookiejar import CookieJar
import re
import sys
from typing import Callable
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit
from urllib.request import HTTPCookieProcessor, HTTPRedirectHandler, Request, build_opener


PAGES = ("/", "/guide", "/glossary", "/shop", "/privacy", "/credits")
COOKIE = "submission_saga_language"
REDIRECTS = (301, 302, 303, 307, 308)


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


@dataclass
class Response:
    status: int
    headers: object
    body: str
    url: str


class Client:
    def __init__(self, base: str, accept_cookies: bool = False) -> None:
        self.base = base.rstrip("/")
        self.jar = CookieJar() if accept_cookies else None
        handlers = [NoRedirect()]
        if self.jar is not None:
            handlers.append(HTTPCookieProcessor(self.jar))
        self.opener = build_opener(*handlers)

    def request(
        self,
        path: str,
        *,
        country: str | None = None,
        cookie: str | None = None,
        headers: dict[str, str] | None = None,
        method: str = "GET",
    ) -> Response:
        url = urljoin(self.base + "/", path)
        request_headers = {"User-Agent": "SubmissionSaga-Locale-Integration/1.0"}
        if country is not None:
            request_headers["x-vercel-ip-country"] = country
        if cookie is not None:
            request_headers["Cookie"] = cookie
        request_headers.update(headers or {})
        request = Request(url, headers=request_headers, method=method)
        try:
            response = self.opener.open(request, timeout=30)
        except HTTPError as error:
            response = error
        with response:
            body = response.read().decode("utf-8", errors="replace")
            return Response(response.code, response.headers, body, url)

    def follow(self, path: str, **kwargs) -> list[Response]:
        responses = []
        current = path
        for _ in range(5):
            result = self.request(current, **kwargs)
            responses.append(result)
            if result.status not in REDIRECTS:
                return responses
            location = result.headers.get("Location")
            require(bool(location), "Redirect lacks a Location header")
            destination = urljoin(result.url, location)
            require(
                urlsplit(destination).netloc == urlsplit(self.base).netloc,
                f"Unexpected cross-origin redirect: {destination}",
            )
            current = destination
        raise AssertionError("Locale request did not settle within five responses")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def status(response: Response, expected: int) -> None:
    require(response.status == expected, f"{response.url}: expected HTTP {expected}, got {response.status}")


def location(response: Response, expected: str) -> None:
    actual = urlsplit(urljoin(response.url, response.headers.get("Location", "")))
    wanted = urlsplit(urljoin(response.url, expected))
    require(actual.netloc == wanted.netloc, f"Redirect changed origin to {actual.netloc}")
    require(actual.path == wanted.path, f"Expected redirect path {wanted.path}, got {actual.path}")
    require(
        parse_qsl(actual.query, keep_blank_values=True) == parse_qsl(wanted.query, keep_blank_values=True),
        f"Redirect changed query: expected {wanted.query!r}, got {actual.query!r}",
    )
    require(not actual.fragment, f"Unexpected server-generated fragment: {actual.fragment}")


def language(response: Response, expected: str) -> None:
    status(response, 200)
    match = re.search(r'<html\b[^>]*\blang=[\"\']([^\"\']+)', response.body, re.IGNORECASE)
    require(match is not None, f"{response.url}: HTML language attribute is missing")
    require(match.group(1) == expected, f"Expected HTML language {expected}, got {match.group(1)}")


def private(response: Response) -> None:
    cache_control = response.headers.get("Cache-Control", "").lower()
    require("private" in cache_control and "no-store" in cache_control,
            f"Personalized response must be private, no-store: {cache_control!r}")


def no_language_cookie(response: Response) -> None:
    values = response.headers.get_all("Set-Cookie", [])
    require(not any(re.search(rf'(^|[,;]\s*){COOKIE}=', value) for value in values),
            f"Request unexpectedly wrote the language preference: {values!r}")


def preference(response: Response, expected: str) -> None:
    values = response.headers.get_all("Set-Cookie", [])
    parsed = SimpleCookie()
    for value in values:
        parsed.load(value)
    require(COOKIE in parsed, f"Explicit selection did not save language: {values!r}")
    saved = parsed[COOKIE]
    require(saved.value == expected, f"Expected saved {expected}, got {saved.value}")
    require(saved["path"] == "/", f"Language cookie has wrong path: {saved['path']!r}")
    require(saved["max-age"] == "31536000", f"Language cookie has wrong lifetime: {saved['max-age']!r}")
    require(bool(saved["httponly"]), "Language cookie must be HttpOnly")
    require(saved["samesite"].lower() == "lax", "Language cookie must use SameSite=Lax")
    is_https = urlsplit(response.url).scheme == "https"
    require(bool(saved["secure"]) == is_https,
            f"Language cookie Secure flag does not match URL scheme {urlsplit(response.url).scheme}")


def portuguese_path(path: str) -> str:
    return "/pt-BR" + ("" if path == "/" else path)


def run(base: str) -> int:
    client = Client(base)
    checks = 0
    failures = []

    def case(name: str, check: Callable[[], None]) -> None:
        nonlocal checks
        try:
            check()
        except (AssertionError, URLError, TimeoutError, OSError) as error:
            failures.append((name, str(error)))
            print(f"FAIL {name}: {error}")
        else:
            checks += 1

    def auto_brazil(path: str) -> None:
        result = client.request(path, country="BR")
        status(result, 307)
        location(result, portuguese_path(path))
        private(result)
        no_language_cookie(result)
        settled = client.follow(path, country="BR")
        require(len(settled) == 2, f"Expected one automatic redirect, got {len(settled) - 1}")
        language(settled[-1], "pt-BR")
        for step in settled:
            no_language_cookie(step)

    def auto_english(path: str, country: str | None) -> None:
        result = client.request(path, country=country, headers={"Accept-Language": "pt-BR,pt;q=0.9"})
        language(result, "en")
        private(result)
        no_language_cookie(result)

    for path in PAGES:
        case(f"Brazil first visit: {path}", lambda path=path: auto_brazil(path))
        case(f"US first visit: {path}", lambda path=path: auto_english(path, "US"))

    for country in (None, "", "ZZ", "PT", "CA", "DE", "AR"):
        case(f"Non-Brazil or unknown country {country!r} ignores browser language",
             lambda country=country: auto_english("/guide", country))

    def explicit_portuguese(country: str | None) -> None:
        for path in PAGES:
            result = client.request(portuguese_path(path), country=country, cookie=f"{COOKIE}=en")
            language(result, "pt-BR")
            no_language_cookie(result)

    for country in ("BR", "US", None):
        case(f"Explicit Portuguese links stay Portuguese in {country!r}",
             lambda country=country: explicit_portuguese(country))

    def query_choice(path: str, choice: str, country: str, old_cookie: str, expected_path: str) -> None:
        query = urlencode([("campaign", "a b"), ("campaign", "second"), ("empty", ""), ("lang", choice)])
        result = client.request(path + "?" + query, country=country, cookie=f"{COOKIE}={old_cookie}")
        private(result)
        preference(result, choice)
        if expected_path != path:
            status(result, 307)
            location(result, expected_path + "?" + query)
        else:
            language(result, choice)
        settled = client.follow(path + "?" + query, country=country, cookie=f"{COOKIE}={old_cookie}")
        require(len(settled) <= 2, "Manual choice caused a redirect loop with cookies rejected")
        language(settled[-1], choice)
        private(settled[-1])
        preference(settled[-1], choice)
        require(parse_qsl(urlsplit(settled[-1].url).query, keep_blank_values=True)
                == parse_qsl(query, keep_blank_values=True), "Final URL lost selection or repeated query values")

    case("English query beats Brazil and saved Portuguese",
         lambda: query_choice("/guide", "en", "BR", "pt-BR", "/guide"))
    case("Portuguese query beats US and saved English",
         lambda: query_choice("/guide", "pt-BR", "US", "en", "/pt-BR/guide"))
    case("English query on Portuguese URL switches back without losing query",
         lambda: query_choice("/pt-BR/glossary", "en", "BR", "pt-BR", "/glossary"))
    case("Portuguese query on Portuguese URL stores the explicit preference",
         lambda: query_choice("/pt-BR/credits", "pt-BR", "US", "en", "/pt-BR/credits"))
    case("Homepage selection preserves homepage URL shape",
         lambda: query_choice("/", "pt-BR", "US", "en", "/pt-BR"))
    case("Homepage selection returns to English",
         lambda: query_choice("/pt-BR", "en", "BR", "pt-BR", "/"))

    def cookie_choice(choice: str, country: str) -> None:
        result = client.request("/shop", country=country, cookie=f"{COOKIE}={choice}")
        private(result)
        no_language_cookie(result)
        if choice == "pt-BR":
            status(result, 307)
            location(result, "/pt-BR/shop")
        else:
            language(result, "en")

    case("Saved English overrides Brazil", lambda: cookie_choice("en", "BR"))
    case("Saved Portuguese overrides another country", lambda: cookie_choice("pt-BR", "US"))

    def invalid_values(query: str | None, saved: str, country: str, expected: str) -> None:
        path = "/guide" + ("?lang=" + query if query is not None else "")
        result = client.request(path, country=country, cookie=f"{COOKIE}={saved}")
        private(result)
        no_language_cookie(result)
        if expected == "pt-BR":
            status(result, 307)
            location(result, "/pt-BR" + path)
        else:
            language(result, "en")

    for invalid in ("", "pt", "pt_BR", "PT-BR", "fr", "../../privacy"):
        case(f"Invalid query {invalid!r} falls through to saved English",
             lambda invalid=invalid: invalid_values(invalid, "en", "BR", "en"))
        case(f"Invalid query {invalid!r} and invalid cookie fall through to country",
             lambda invalid=invalid: invalid_values(invalid, "invalid", "BR", "pt-BR"))
    case("Invalid cookie defaults English outside Brazil", lambda: invalid_values(None, "pt_BR", "US", "en"))
    case("Invalid query respects saved Portuguese", lambda: invalid_values("invalid", "pt-BR", "US", "pt-BR"))

    def automatic_query() -> None:
        path = "/glossary?tag=guard&tag=top&empty=&ref=a%2Bb%20c"
        result = client.request(path, country="BR")
        status(result, 307)
        location(result, "/pt-BR" + path)
        no_language_cookie(result)

    case("Automatic redirect preserves repeated and encoded query parameters", automatic_query)

    def safe_read(method: str, headers: dict[str, str], path: str, expected: int, expected_location: str | None) -> None:
        result = client.request(path, method=method, headers=headers, country="BR")
        status(result, expected)
        no_language_cookie(result)
        private(result)
        if expected_location:
            location(result, expected_location)
        if method == "HEAD":
            require(not result.body, "HEAD response unexpectedly contained a body")

    case("HEAD automatic choice redirects without cookie",
         lambda: safe_read("HEAD", {}, "/guide", 307, "/pt-BR/guide"))
    case("HEAD explicit English selection does not write cookie",
         lambda: safe_read("HEAD", {}, "/guide?lang=en", 200, None))
    case("HEAD explicit Portuguese selection does not write cookie",
         lambda: safe_read("HEAD", {}, "/guide?lang=pt-BR", 307, "/pt-BR/guide?lang=pt-BR"))
    for header, value in (("purpose", "prefetch"), ("sec-purpose", "prefetch"), ("sec-purpose", "prefetch;prerender")):
        case(f"{header}: {value} does not persist English selection",
             lambda header=header, value=value: safe_read("GET", {header: value}, "/guide?lang=en", 200, None))
        case(f"{header}: {value} does not persist Portuguese selection",
             lambda header=header, value=value: safe_read("GET", {header: value}, "/guide?lang=pt-BR", 307, "/pt-BR/guide?lang=pt-BR"))

    for destination in ("empty", "image", "iframe"):
        case(f"sec-fetch-dest {destination!r} does not persist a preference",
             lambda destination=destination: safe_read("GET", {"sec-fetch-dest": destination}, "/guide?lang=en", 200, None))

    def document_selection() -> None:
        result = client.request("/guide?lang=en", country="BR", headers={"sec-fetch-dest": "document"})
        language(result, "en")
        preference(result, "en")
        private(result)

    case("Normal document navigation saves an explicit preference", document_selection)

    def excluded(path: str, method: str = "GET") -> None:
        result = client.request(path, country="BR", method=method)
        require(result.status not in REDIRECTS, f"Excluded path or method received HTTP {result.status}")
        no_language_cookie(result)

    for path in ("/api/__language_route_probe?lang=pt-BR", "/_next/static/__language_route_probe.js?lang=pt-BR",
                 "/favicon.ico?lang=pt-BR", "/__language_route_probe?lang=pt-BR",
                 "/pt-BR/__language_route_probe?lang=en"):
        case(f"Excluded URL stays untouched: {path}", lambda path=path: excluded(path))
    case("POST page request does not redirect or store a preference",
         lambda: excluded("/guide?lang=pt-BR", method="POST"))

    def old_english_prefix() -> None:
        result = client.request("/en/guide?campaign=a&campaign=b", country="BR")
        status(result, 308)
        location(result, "/guide?campaign=a&campaign=b")
        no_language_cookie(result)
        sequence = client.follow("/en/guide?lang=en", country="BR")
        require(len(sequence) == 2, "Legacy English prefix with explicit English choice did not settle directly")
        language(sequence[-1], "en")

    case("Legacy /en canonical redirect remains intact", old_english_prefix)

    def cookiejar_flow() -> None:
        visitor = Client(base, accept_cookies=True)
        automatic = visitor.follow("/guide", country="BR")
        language(automatic[-1], "pt-BR")
        require(len(list(visitor.jar)) == 0, "Automatic detection saved an unsolicited preference")
        selected_english = visitor.follow("/pt-BR/guide?lang=en", country="BR")
        language(selected_english[-1], "en")
        require(any(item.name == COOKIE and item.value == "en" for item in visitor.jar),
                "HTTP cookie jar did not retain explicit English selection")
        next_page = visitor.follow("/privacy", country="BR")
        require(len(next_page) == 1, "Saved English preference did not suppress Brazil redirect")
        language(next_page[-1], "en")
        selected_portuguese = visitor.follow("/credits?lang=pt-BR", country="US")
        language(selected_portuguese[-1], "pt-BR")
        require(any(item.name == COOKIE and item.value == "pt-BR" for item in visitor.jar),
                "HTTP cookie jar did not retain explicit Portuguese selection")
        later_page = visitor.follow("/glossary", country="US")
        require(len(later_page) == 2, "Saved Portuguese preference did not localize the next visit")
        language(later_page[-1], "pt-BR")

    case("Complete no-JavaScript visit remembers explicit choices in an HTTP cookie jar", cookiejar_flow)

    print(f"\n{checks} routing checks passed; {len(failures)} failed.")
    if urlsplit(base).scheme != "https":
        print("HTTP cookie flags checked. To verify Secure on HTTPS, rerun with --url https://<test-host>.")
    return 1 if failures else 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://127.0.0.1:3100", help="Running website origin")
    args = parser.parse_args()
    return run(args.url)


if __name__ == "__main__":
    sys.exit(main())
