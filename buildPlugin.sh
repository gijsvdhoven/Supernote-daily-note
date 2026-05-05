#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

BUILD_DIR="$SCRIPT_DIR/build"
BUNDLE_DIR="$BUILD_DIR/bundle"
OUTPUT_DIR="$BUILD_DIR/outputs"
PLUGIN_NAME="SupernoteDailyNote"

echo "=== Supernote Daily Note — Build ==="

echo "[1/4] Installing dependencies..."
npm install

echo "[2/4] Bundling JS..."
mkdir -p "$BUNDLE_DIR/assets"
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output "$BUNDLE_DIR/index.android.bundle" \
  --assets-dest "$BUNDLE_DIR/assets"

echo "[3/4] Copying plugin config..."
cp PluginConfig.json "$BUNDLE_DIR/"

echo "[4/4] Packaging .snplg..."
mkdir -p "$OUTPUT_DIR"
(cd "$BUNDLE_DIR" && zip -r "$OUTPUT_DIR/${PLUGIN_NAME}.snplg" .)

echo ""
echo "Done: $OUTPUT_DIR/${PLUGIN_NAME}.snplg"
echo ""
echo "Install: copy the .snplg file to the MyStyle/ folder on your Supernote,"
echo "then open Settings → Apps → Plugins to enable it."
