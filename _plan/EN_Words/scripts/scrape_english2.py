#!/usr/bin/env python3
"""Extract 考研英语二 Part A reading texts from csgraduates.com markdown."""

import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]  # EN_Words/


def clean_line(line: str) -> str:
    line = line.strip()
    if not line:
        return ""
    # skip nav / UI
    if line in ("查看答案与解析  收藏", "查看答案与解析 收藏", "**Directions**"):
        return ""
    if line.startswith("**正确答案"):
        return ""
    if re.match(r"^[A-D]\.\s", line) and len(line) < 120:
        return ""
    if re.match(r"^##### \d+", line):
        return "__Q__"
    # markdown escapes
    line = line.replace(r"\.", ".")
    line = re.sub(r"\\([\[\]()])", r"\1", line)
    line = re.sub(r"\*\*([^*]+)\*\*", r"\1", line)
    return line


def extract_reading(md: str) -> dict[int, str]:
    # find Part A reading section
    m = re.search(r"### 阅读理解\s*\n+#### Part A", md)
    if not m:
        m = re.search(r"### 阅读理解", md)
    if not m:
        return {}
    section = md[m.start() :]

    # stop at Part B or 翻译
    for stop in ("#### Part B", "### 阅读理解 B", "### 翻译", "### 写作"):
        idx = section.find(stop)
        if idx > 0:
            section = section[:idx]

    texts = {}
    parts = re.split(r"(?=#### Text\s*[1-4]\s*\n)", section)
    for part in parts:
        hm = re.match(r"#### Text\s*([1-4])\s*\n", part)
        if not hm:
            continue
        n = int(hm.group(1))
        body = part[hm.end() :]
        # cut at first question
        qm = re.search(r"\n##### \d+", body)
        if qm:
            body = body[: qm.start()]
        lines = []
        for raw in body.splitlines():
            cl = clean_line(raw)
            if cl == "__Q__":
                break
            if cl:
                lines.append(cl)
        texts[n] = "\n\n".join(lines)
    return texts


# Known OCR fixes for passages corrupted on source site
OCR_FIXES: dict[int, list[tuple[str, str]]] = {
    2013: [
        (
            "7milin people arrived while about 2 million departed. About a quarter of all Italia immigrants, for example, eventually returned to ltaly for good. They even had an affectionate nickname,“uccelli i passaggio,” birds of passage.",
            '7 million people arrived while about 2 million departed. About a quarter of all Italian immigrants, for example, eventually returned to Italy for good. They even had an affectionate nickname, "uccelli di passaggio," birds of passage.',
        ),
        (
            "We divide newcomers into two categories: legal or lll go o od we aith as - meican nnte aking o or rokun imiraion system and the long political paralysis over how to fix it, We don’t need more categories,but we need to change the way we think about categories. We need to look beyond stict definitions of legal and illegal.",
            "We divide newcomers into two categories: legal or illegal, good or bad. We hail them as Americans in the making, or brand them as aliens to be kicked out. That framework has contributed mightily to our broken immigration system and the long political paralysis over how to fix it. We don't need more categories, but we need to change the way we think about categories. We need to look beyond strict definitions of legal and illegal.",
        ),
        ("Crop pickers,violinists", "Crop pickers, violinists"),
        ("engineers, ome health-care", "engineers, home health-care"),
        ("fiow of work,money", "flow of work, money"),
        ("immigration batle Lokin byond the cultur war logic of right or wrong means opening up the midle ground", "immigration battle. Looking beyond the culture war logic of right or wrong means opening up the middle ground"),
    ],
}


def apply_ocr_fixes(year: int, text: str) -> str:
    for old, new in OCR_FIXES.get(year, []):
        text = text.replace(old, new)
    return text


def write_year(year: int, texts: dict[int, str]) -> None:
    out_dir = BASE / str(year)
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"{year}.txt"
    chunks = []
    for i in range(1, 5):
        chunks.append(f"Text {i}")
        body = apply_ocr_fixes(year, texts.get(i, "").strip())
        chunks.append(body)
        chunks.append("")
    out.write_text("\n".join(chunks).strip() + "\n", encoding="utf-8")
    print(f"  wrote {out} ({sum(len(texts.get(i,'')) for i in range(1,5))} chars)")


def main():
    if len(sys.argv) < 2:
        print("Usage: scrape_english2.py <markdown file> [year]")
        sys.exit(1)
    path = Path(sys.argv[1])
    year = int(sys.argv[2]) if len(sys.argv) > 2 else int(path.stem.split("-")[0])
    md = path.read_text(encoding="utf-8", errors="replace")
    texts = extract_reading(md)
    if not texts:
        print(f"No texts found in {path}")
        sys.exit(1)
    write_year(year, texts)
    print(f"  extracted: {sorted(texts.keys())}")


if __name__ == "__main__":
    main()
