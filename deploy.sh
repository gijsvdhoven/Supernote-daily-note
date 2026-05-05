#!/bin/bash
set -euo pipefail

# Build the plugin
echo "Building plugin..."
./buildPlugin.sh

# Deploy to device
echo ""
echo "Deploying to device..."
adb push build/outputs/SupernoteDailyNote.snplg /sdcard/MyStyle/

echo ""
echo "✅ Plugin built and deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Open Settings → Apps → Plugins on your Supernote device"
echo "2. Install the SupernoteDailyNote plugin"
echo "3. Check adb logcat for any errors:"
echo "   adb logcat -c && sleep 15 && adb logcat -d | grep -i 'plugin\\|error\\|exception'"
