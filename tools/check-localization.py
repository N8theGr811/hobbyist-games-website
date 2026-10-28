#!/usr/bin/env python3
"""Check translation tokens and rendered bilingual routes without submitting forms.

Run after starting the site: python3 tools/check-localization.py --url http://127.0.0.1:3100
Without --url, checks authored dictionaries and exported game-text coverage only.
"""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parent.parent
PAGES = ("", "/guide", "/glossary", "/shop", "/privacy", "/credits")
ORIGIN = "https://www.submissionsaga.com"


def read_json(path: Path) -> dict:
    def unique(pairs: list[tuple[str, object]]) -> dict:
        result = {}
        for key, value in pairs:
            assert key not in result, f"Duplicate translation key: {key}"
            result[key] = value
        return result
    return json.loads(path.read_text(), object_pairs_hook=unique)


class Page(HTMLParser):
    def __init__(self, html: str) -> None:
        super().__init__()
        self.lang = ""
        self.links: list[dict[str, str]] = []
        self.text: list[str] = []
        self.attributes: list[str] = []
        self.skipped = 0
        self.feed(html)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "html":
            self.lang = values.get("lang", "")
        if tag in ("script", "style"):
            self.skipped += 1
        if tag in ("a", "link"):
            self.links.append(values)
        for key in ("alt", "aria-label", "placeholder", "title"):
            if values.get(key):
                self.attributes.append(values[key])

    def handle_endtag(self, tag: str) -> None:
        if tag in ("script", "style"):
            self.skipped -= 1

    def handle_data(self, text: str) -> None:
        if not self.skipped and text.strip():
            self.text.append(text.strip())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url")
    args = parser.parse_args()
    directory = ROOT / "src/lib/i18n"
    dictionaries = [read_json(directory / name) for name in (
        "common.pt-BR.json", "pages.pt-BR.json", "shop.pt-BR.json", "glossary.pt-BR.json"
    )]
    count = 0
    for dictionary in dictionaries:
        for source, target in dictionary.items():
            count += 1
            assert target.strip(), f"Empty translation: {source}"
            assert "\u2014" not in target, f"Em dash: {source}"
            tokens = lambda text: sorted(re.findall(r"\{\w+\}", text))
            assert tokens(source) == tokens(target), f"Changed placeholders: {source}"
    source = read_json(ROOT / "src/lib/glossary.json")
    translated = read_json(directory / "glossary-game.pt-BR.json")
    for section in ("moves", "positions", "families"):
        assert {item["id"] for item in source[section]} == set(translated[section]), f"Missing {section}"
    print(f"OK: {count} authored translations; placeholders, duplicate keys and game-text coverage")
    if not args.url:
        return
    english = {s.strip() for dictionary in dictionaries for s, t in dictionary.items() if s != t and len(s.strip()) > 6}
    for locale in ("en", "pt-BR"):
        for path in PAGES:
            route = ("/pt-BR" if locale == "pt-BR" else "") + path or "/"
            with urlopen(args.url.rstrip("/") + route) as response:
                assert response.status == 200, route
                page = Page(response.read().decode())
            assert page.lang == locale, f"Wrong html lang: {route}"
            canonical = next(link["href"] for link in page.links if link.get("rel") == "canonical")
            assert canonical.rstrip("/") == (ORIGIN + route).rstrip("/"), f"Canonical: {route} {canonical}"
            alternates = {link.get("hreflang"): link["href"] for link in page.links if link.get("rel") == "alternate"}
            assert alternates.get("en", "").rstrip("/") == (ORIGIN + path).rstrip("/"), route
            assert alternates.get("pt-BR", "").rstrip("/") == (ORIGIN + "/pt-BR" + path).rstrip("/"), route
            switch = [link for link in page.links if link.get("hreflang") == ("en" if locale == "pt-BR" else "pt-BR") and "rel" not in link]
            assert switch, f"Missing language switch: {route}"
            if locale == "pt-BR":
                leaks = set(page.text + page.attributes) & english
                assert not leaks, f"Untranslated copy in {route}: {sorted(leaks)}"
                for link in page.links:
                    href = link.get("href", "")
                    base = re.split(r"[?#]", href)[0]
                    assert base not in ["/"] + list(PAGES[1:]) or link.get("hreflang") == "en", f"English navigation on {route}: {href}"
            print(f"OK: {route} language, links, canonical and translation coverage")
    for route in ("/missing-page", "/pt-BR/missing-page", "/fr/guide"):
        try:
            urlopen(args.url.rstrip("/") + route)
        except HTTPError as error:
            assert error.code == 404, f"Expected 404: {route}"
        else:
            raise AssertionError(f"Unknown page did not return 404: {route}")
    print("OK: unknown pages return 404")


if __name__ == "__main__":
    main()
