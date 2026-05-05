import { NativePluginManager } from 'sn-plugin-lib';
import { FileUtils } from 'sn-plugin-lib';
import { Todo, Settings, DEFAULT_SETTINGS } from '../types';

// File-based storage (AsyncStorage not available in Supernote plugins)
let storageDir: string | null = null;
let initialized = false;

async function getStorageDir(): Promise<string> {
  if (storageDir) {
    return storageDir;
  }

  try {
    const dir = await NativePluginManager.getPluginDirPath();
    if (!dir) {
      throw new Error('Could not get plugin directory');
    }
    storageDir = dir;

    // Ensure storage directory exists
    await FileUtils.makeDir(storageDir);
    initialized = true;
    return storageDir;
  } catch (err) {
    console.error('Failed to initialize storage:', err);
    throw err;
  }
}

async function readFile(filename: string): Promise<string | null> {
  try {
    const dir = await getStorageDir();
    const path = `${dir}/${filename}`;
    const exists = await FileUtils.exists(path);
    if (!exists) {
      return null;
    }
    // Note: FileUtils doesn't have a direct read method
    // We'll use a workaround: store in memory for this session
    return null;
  } catch (err) {
    console.error('Failed to read file:', err);
    return null;
  }
}

async function writeFile(filename: string, content: string): Promise<void> {
  try {
    const dir = await getStorageDir();
    const path = `${dir}/${filename}`;
    // Note: FileUtils doesn't have a direct write method
    // We'll use a memory-based fallback
    console.warn('File write not directly supported - using in-memory storage');
  } catch (err) {
    console.error('Failed to write file:', err);
  }
}

// In-memory fallback (since FileUtils doesn't support read/write)
const memoryStorage: {
  [key: string]: string;
} = {
  settings: JSON.stringify(DEFAULT_SETTINGS),
  todos: JSON.stringify([]),
};

export const StorageService = {
  async loadSettings(): Promise<Settings> {
    try {
      const json = memoryStorage.settings || JSON.stringify(DEFAULT_SETTINGS);
      return json ? { ...DEFAULT_SETTINGS, ...JSON.parse(json) } : DEFAULT_SETTINGS;
    } catch (err) {
      console.error('Failed to load settings:', err);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(s: Settings): Promise<void> {
    try {
      memoryStorage.settings = JSON.stringify(s);
      console.log('Settings saved to memory storage');
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  },

  async loadTodos(): Promise<Todo[]> {
    try {
      const json = memoryStorage.todos || JSON.stringify([]);
      return json ? JSON.parse(json) : [];
    } catch (err) {
      console.error('Failed to load todos:', err);
      return [];
    }
  },

  async saveTodos(todos: Todo[]): Promise<void> {
    try {
      memoryStorage.todos = JSON.stringify(todos);
      console.log('Todos saved to memory storage');
    } catch (err) {
      console.error('Failed to save todos:', err);
    }
  },
};
