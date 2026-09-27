"""Check generated pages for broken local assets and basic document structure."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent
PAGES = ["", "pquant", "pfield", "psite", "beta", "contact"]


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.labels: list[str] = []
        self.local_urls: list[str] = []
        self.h1_count = 0
        self.lang = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = dict(attrs)
        if tag == "html":
            self.lang = attr.get("lang") or ""
        if tag == "h1":
            self.h1_count += 1
        if attr.get("id"):
            self.ids.append(attr["id"])
        if tag == "label" and attr.get("for"):
            self.labels.append(attr["for"])
        for name in ("href", "src"):
            value = attr.get(name)
            if value and value.startswith("/"):
                self.local_urls.append(value)


for lang in ("fi", "en"):
    for page in PAGES:
        file = ROOT / ("en" if lang == "en" else "") / page / "index.html"
        if not page:
            file = ROOT / ("en" if lang == "en" else "") / "index.html"
        parser = PageParser()
        parser.feed(file.read_text(encoding="utf-8"))
        assert parser.lang == lang, file
        assert parser.h1_count == 1, file
        assert len(parser.ids) == len(set(parser.ids)), f"Duplicate id: {file}"
        assert set(parser.labels) <= set(parser.ids), f"Unbound label: {file}"
        for url in parser.local_urls:
            path = unquote(urlsplit(url).path)
            target = ROOT / path.lstrip("/")
            if path.endswith("/"):
                target /= "index.html"
            assert target.exists(), f"{file}: broken {url}"

print("Twelve FI/EN pages: local links, assets, labels, IDs and H1s passed.")
