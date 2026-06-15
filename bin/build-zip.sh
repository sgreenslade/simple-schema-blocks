#!/usr/bin/env bash
set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PLUGIN_FILE="$PLUGIN_DIR/simple-schema-blocks.php"

VERSION=$(grep -m1 '^ \* Version:' "$PLUGIN_FILE" | sed 's/.*Version:[[:space:]]*//')

if [[ -z "$VERSION" ]]; then
  echo "Error: could not read version from $PLUGIN_FILE" >&2
  exit 1
fi

ZIP_NAME="simple-schema-blocks-$VERSION.zip"
OUTPUT="${1:-$PLUGIN_DIR/$ZIP_NAME}"

cd "$PLUGIN_DIR/.."

zip -r "$OUTPUT" \
  simple-schema-blocks/simple-schema-blocks.php \
  simple-schema-blocks/readme.txt \
  simple-schema-blocks/build \
  simple-schema-blocks/includes \
  simple-schema-blocks/languages \
  simple-schema-blocks/assets \
  --exclude "*/.DS_Store" \
  --exclude "*/assets/ASSETS.md"

echo "Built $OUTPUT (v$VERSION)"
