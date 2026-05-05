# Daily Notes Plugin - Development Guide

## Version Management

**IMPORTANT**: Every time you make changes to the code, you must bump the version number in:
1. `package.json` - the `version` field
2. `PluginConfig.json` - the `versionName` field

### Version Bumping Rules

Use semantic versioning (MAJOR.MINOR.PATCH):

- **PATCH** (e.g., 1.0.0 → 1.0.1): Bug fixes, minor UI improvements
- **MINOR** (e.g., 1.0.0 → 1.1.0): New features, significant enhancements
- **MAJOR** (e.g., 1.0.0 → 2.0.0): Breaking changes, architectural refactors

### When to Bump Version

✅ **Always bump when:**
- Adding new features
- Fixing bugs
- Updating UI components
- Modifying services or logic
- Updating dependencies
- Changing configuration

### How to Bump Version

1. Update `package.json`:
   ```json
   "version": "X.Y.Z"
   ```

2. Update `PluginConfig.json`:
   ```json
   "versionName": "X.Y.Z"
   ```

3. If needed, increment `versionCode`:
   ```json
   "versionCode": "N"
   ```

### Example Workflow

```bash
# Make your changes
# Update version in both files
# Commit with version bump in message
git add package.json PluginConfig.json
git commit -m "feat: add cool feature (v1.1.0)"
```

## Architecture

- `index.js` - Plugin initialization and button registration
- `App.tsx` - Main UI state management and screen routing
- `src/screens/HomeScreen.tsx` - Date navigation and note opening
- `src/screens/SettingsScreen.tsx` - Settings form
- `src/services/` - Business logic (NoteService, StorageService, etc.)
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions

## Build & Deploy

```bash
# Build and push to device
./deploy.sh

# Or manually:
./buildPlugin.sh                                    # Build
adb push build/outputs/SupernoteDailyNote.snplg /sdcard/MyStyle/  # Deploy
```

## Testing

After changes:
1. Run `npm run lint` to check code style
2. Build with `./deploy.sh`
3. Install on device
4. Test functionality
5. Check logs: `adb logcat -d | grep -i plugin`

## Services Overview

- **NoteService**: Creates/opens daily notes, manages note files
- **DateService**: Date formatting, navigation, calculations
- **StorageService**: Persists settings and todos locally
- **TodoService**: Handles todo recognition from handwriting
