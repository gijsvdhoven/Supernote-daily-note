import {PluginCommAPI, PluginFileAPI, PluginNoteAPI, FileUtils} from 'sn-plugin-lib';
import {StorageService} from './StorageService';
import {formatDate, getLocalToday, parseDateFromFilename, addDays} from './DateService';
import {Todo, Settings} from '../types';

let busy = false;

async function getExternalRoot(): Promise<string | null> {
  const dirs = await FileUtils.getExternalDirPath();
  return (Array.isArray(dirs) ? dirs[0] : null) ?? null;
}

async function buildNotePath(date: Date, settings: Settings): Promise<string | null> {
  const root = await getExternalRoot();
  if (!root) {
    return null;
  }
  const filename = formatDate(date, settings.dateFormat) + '.note';
  return `${root}/${settings.folder}/${filename}`;
}

async function ensureFolder(folderPath: string): Promise<void> {
  const exists = await FileUtils.exists(folderPath);
  if (!exists) {
    await FileUtils.makeDir(folderPath);
  }
}

async function createNoteFile(notePath: string, templatePath: string): Promise<boolean> {
  const tryCreate = async (tmpl: string): Promise<boolean> => {
    const result = await PluginFileAPI.createNote({
      notePath,
      template: tmpl,
      mode: 0,
      isPortrait: true,
    });
    if (typeof result === 'boolean') {
      return result;
    }
    return (result as {success?: boolean})?.success ?? false;
  };

  const ok = await tryCreate(templatePath);
  // If the configured template no longer exists, fall back to blank note
  if (!ok && templatePath) {
    return tryCreate('');
  }
  return ok;
}

// Inserts unchecked todos as a TextBox block at the top of page 1.
// Each line is prefixed with □ (U+25A2) so "Mark Done" lasso can identify them.
async function insertTodosAsTextBox(notePath: string, todos: Todo[]): Promise<void> {
  const unchecked = todos.filter(t => !t.checked);
  if (unchecked.length === 0) {
    return;
  }
  const text = unchecked.map(t => `▢ ${t.text}`).join('\n');
  await PluginNoteAPI.insertTextBox(notePath, 1, {
    text,
    x: 60,
    y: 60,
    width: 1752,
    height: Math.min(unchecked.length * 64 + 24, 500),
    fontSize: 32,
  });
}

async function openOrCreate(date: Date, settings: Settings): Promise<void> {
  const root = await getExternalRoot();
  if (!root) {
    console.error('[DailyNote] Could not resolve external storage path');
    return;
  }
  const notePath = await buildNotePath(date, settings);
  if (!notePath) {
    return;
  }
  await ensureFolder(`${root}/${settings.folder}`);

  const exists = await FileUtils.exists(notePath);
  if (!exists) {
    const created = await createNoteFile(notePath, settings.templatePath);
    if (created) {
      const todos = await StorageService.loadTodos();
      await insertTodosAsTextBox(notePath, todos);
    }
  }

  await FileUtils.openFilePath(notePath);
}

export const NoteService = {
  async openOrCreateNote(date: Date): Promise<void> {
    if (busy) {
      return;
    }
    busy = true;
    try {
      const settings = await StorageService.loadSettings();
      await openOrCreate(date, settings);
    } finally {
      busy = false;
    }
  },

  // Determines the base date from the currently open file (if it's a daily note),
  // then navigates by offsetDays relative to that date.
  async navigateRelative(offsetDays: number): Promise<void> {
    if (busy) {
      return;
    }
    busy = true;
    try {
      const settings = await StorageService.loadSettings();
      let baseDate = getLocalToday();

      const currentPath = await PluginCommAPI.getCurrentFilePath();
      if (currentPath) {
        const filename = currentPath.split('/').pop()?.replace(/\.note$/, '') ?? '';
        const parsed = parseDateFromFilename(filename, settings.dateFormat);
        if (parsed) {
          baseDate = parsed;
        }
      }

      const target = addDays(baseDate, offsetDays);
      await openOrCreate(target, settings);
    } finally {
      busy = false;
    }
  },
};
