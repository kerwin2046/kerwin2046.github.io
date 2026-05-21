#!/usr/bin/env python3
"""Extract 考研英语二 Part C translation and writing prompts from csgraduates markdown."""

import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]


def clean_md_line(line: str) -> str:
    line = line.strip()
    if not line or line in ("查看答案与解析  收藏", "查看答案与解析 收藏"):
        return ""
    if line.startswith("**Directions") or line == "Directions":
        return ""
    line = line.replace(r"\.", ".")
    line = re.sub(r"\\([\[\]()])", r"\1", line)
    line = re.sub(r"\*\*([^*]+)\*\*", r"\1", line)
    return line


def extract_translation(md: str) -> dict:
    """Return {english, reference_zh, tips}"""
    m = re.search(r"#### Part C\s*\n", md)
    if not m:
        return {}
    section = md[m.start() :]
    # stop at 写作
    end = section.find("### 写作")
    if end > 0:
        section = section[:end]

    # English: after ##### 46 until 【参考 or 查看答案 block before 参考
    eng_m = re.search(r"##### 46\s*\n", section)
    if not eng_m:
        return {}
    body = section[eng_m.end() :]
    ref_m = re.search(r"【参考译文】", body)
    parse_m = re.search(r"【原文解析】", body)
    tips_m = re.search(r"【翻译要点", body)
    view_m = re.search(r"查看答案与解析", body)

    cut = len(body)
    for marker in (ref_m, parse_m, tips_m, view_m):
        if marker and marker.start() < cut:
            cut = marker.start()
    english_lines = []
    for raw in body[:cut].splitlines():
        cl = clean_md_line(raw)
        if cl and not cl.startswith("Translate the following"):
            english_lines.append(cl)
    english = "\n\n".join(english_lines).strip()

    reference_zh = ""
    if ref_m:
        ref_end = body.find("【", ref_m.end())
        if ref_end < 0:
            ref_end = len(body)
        reference_zh = body[ref_m.end() : ref_end].strip()
        reference_zh = re.sub(r"^【参考译文】\s*", "", reference_zh).strip()

    tips = ""
    if tips_m:
        chunk = body[tips_m.start() :]
        chunk = re.sub(r"^【翻译要点解析】\s*", "", chunk)
        tip_lines = []
        for line in chunk.splitlines():
            s = line.strip()
            if s.startswith("###") or s.startswith("【"):
                break
            if re.match(r"^\d+\.\s", s):
                tip_lines.append(line)
        tips = "\n".join(tip_lines).strip()

    return {"english": english, "reference_zh": reference_zh, "tips": tips}


def extract_writing(md: str) -> dict:
    """Return {part_a, part_b, part_a_sample, part_b_sample}"""
    m = re.search(r"### 写作\s*\n", md)
    if not m:
        return {}
    section = md[m.start() :]

    result = {}

    # Part A - ##### 47
    pa = re.search(r"#### Part A\s*\n+##### 47\s*\n", section)
    if pa:
        body = section[pa.end() :]
        pb_start = re.search(r"#### Part B", body)
        part_a_block = body[: pb_start.start()] if pb_start else body
        cut = len(part_a_block)
        for marker in re.finditer(r"【(?:答案|参考|要点|解析)", part_a_block):
            cut = min(cut, marker.start())
        view = part_a_block.find("查看答案与解析")
        if view >= 0:
            cut = min(cut, view)
        directions = []
        for raw in part_a_block[:cut].splitlines():
            cl = clean_md_line(raw)
            if cl:
                directions.append(cl)
        result["part_a"] = "\n".join(directions).strip()

        if sample_m := re.search(r"【(?:答案示例|参考范文)】\s*\n+([\s\S]*?)(?=\n【|\n####|\Z)", part_a_block):
            result["part_a_sample"] = sample_m.group(1).strip()

    # Part B - ##### 48
    pb = re.search(r"#### Part B\s*\n+##### 48\s*\n", section)
    if pb:
        body = section[pb.end() :]
        cut = len(body)
        for marker in re.finditer(r"【(?:答案|参考|解析)", body):
            cut = min(cut, marker.start())
        view = body.find("查看答案与解析")
        if view >= 0:
            cut = min(cut, view)
        directions = []
        for raw in body[:cut].splitlines():
            cl = clean_md_line(raw)
            if not cl:
                continue
            # skip leaked 解析 bullets (Chinese advice mixed into directions)
            if re.match(r"^\d+\.\s*[\u4e00-\u9fff]", cl) and "chart" not in cl.lower() and "essay" not in cl.lower():
                break
            directions.append(cl)
        result["part_b"] = "\n".join(directions).strip()

        if sample_m := re.search(r"【答案范文】\s*\n+([\s\S]*?)(?=\n【|\Z)", body):
            result["part_b_sample"] = sample_m.group(1).strip()

    return result


def write_translation(year: int, data: dict) -> None:
    out_dir = BASE / "translation"
    out_dir.mkdir(parents=True, exist_ok=True)
    parts = [f"# {year} 考研英语（二）翻译 Part C", ""]
    parts.append("## 英文原文")
    parts.append(data.get("english", "").strip() or "（未提取到原文）")
    parts.append("")
    if data.get("reference_zh"):
        parts.append("## 参考译文")
        parts.append(data["reference_zh"].strip())
        parts.append("")
    if data.get("tips"):
        parts.append("## 翻译要点（网站解析摘要）")
        parts.append(data["tips"][:2000].strip())
        parts.append("")
    (out_dir / f"{year}.md").write_text("\n".join(parts), encoding="utf-8")
    print(f"  translation/{year}.md")


def write_writing(year: int, data: dict) -> None:
    out_dir = BASE / "writing"
    out_dir.mkdir(parents=True, exist_ok=True)
    parts = [f"# {year} 考研英语（二）写作", ""]
    parts.append("## Part A 小作文（约 100 词）")
    parts.append(data.get("part_a", "").strip() or "（未提取到题干）")
    parts.append("")
    if data.get("part_a_sample"):
        parts.append("### 参考示例")
        parts.append(data["part_a_sample"].strip())
        parts.append("")
    parts.append("## Part B 大作文（约 150 词）")
    parts.append(data.get("part_b", "").strip() or "（未提取到题干）")
    parts.append("")
    if data.get("part_b_sample"):
        parts.append("### 参考范文")
        parts.append(data["part_b_sample"].strip())
        parts.append("")
    (out_dir / f"{year}.md").write_text("\n".join(parts), encoding="utf-8")
    print(f"  writing/{year}.md")


def main():
    if len(sys.argv) < 2:
        print("Usage: scrape_translation_writing.py <markdown> [year]")
        sys.exit(1)
    path = Path(sys.argv[1])
    year = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    if not year:
        for part in path.stem.split("-"):
            if part.isdigit() and len(part) == 4:
                year = int(part)
                break
    md = path.read_text(encoding="utf-8", errors="replace")
    tr = extract_translation(md)
    wr = extract_writing(md)
    if tr:
        write_translation(year, tr)
    else:
        print(f"  no translation for {year}")
    if wr:
        write_writing(year, wr)
    else:
        print(f"  no writing for {year}")


if __name__ == "__main__":
    main()
