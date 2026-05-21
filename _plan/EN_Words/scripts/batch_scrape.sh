#!/bin/bash
# Process fetched markdown from agent-tools
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE="$(dirname "$SCRIPT_DIR")"
TOOLS="/home/chenyibwgmail.com/.cursor/projects/home-chenyibwgmail-com-Projects-CHENYI-kerwin2046-github-io/agent-tools"
UPLOADS="/home/chenyibwgmail.com/.cursor/projects/home-chenyibwgmail-com-Projects-CHENYI-kerwin2046-github-io/uploads"

declare -A FILES=(
  [2013]="$UPLOADS/2013-0.md"
  [2014]="$TOOLS/3ca7c9c9-0fa8-4232-95f6-52f030506f5b.txt"
  [2015]="$TOOLS/b759ba38-e24a-416b-93f9-12761a29b798.txt"
  [2016]="$TOOLS/6d9b5fdc-64be-4e32-8389-7769d685859f.txt"
  [2017]="$TOOLS/da438012-f3f1-4a94-913d-3d1fe5d03475.txt"
  [2018]="$TOOLS/6eee8c89-8419-4efd-aa97-2983c01cce22.txt"
  [2019]="$TOOLS/9a27ed7f-9065-45cb-b44e-2c8cc8c385e7.txt"
  [2020]="$TOOLS/6578b761-56f3-4901-bf2f-856f905d6e12.txt"
  [2021]="$TOOLS/11e04bb5-0f87-4872-ab0d-44ab56cf42e1.txt"
  [2022]="$TOOLS/9fa00266-382c-454e-8d8a-2a3556ed2e5f.txt"
  [2023]="$TOOLS/2fc365f1-1c4c-4813-8754-414830d97dda.txt"
  [2024]="$TOOLS/1e7a8af4-eb58-4f90-b4b2-7d875a586e53.txt"
  [2025]="$TOOLS/77b61033-1814-405c-b2b4-c41816e1aa75.txt"
  [2026]="$TOOLS/2438d39d-f69a-4e8b-80a5-82684defb557.txt"
)

for y in $(seq 2013 2026); do
  f="${FILES[$y]}"
  if [[ -f "$f" ]]; then
    python3 "$SCRIPT_DIR/scrape_english2.py" "$f" "$y" || echo "FAILED $y"
  else
    echo "MISSING $y: $f"
  fi
done
