import AsyncStorage from '@react-native-async-storage/async-storage';
import {Todo, Settings, DEFAULT_SETTINGS} from '../types';

const KEYS = {
  SETTINGS: '@dn_settings',
  TODOS: '@dn_todos',
} as const;

export const StorageService = {
  async loadSettings(): Promise<Settings> {
    try {
      const json = await AsyncStorage.getItem(KEYS.SETTINGS);
      return json ? {...DEFAULT_SETTINGS, ...JSON.parse(json)} : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(s: Settings): Promise<void> {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));
  },

  async loadTodos(): Promise<Todo[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.TODOS);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  async saveTodos(todos: Todo[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.TODOS, JSON.stringify(todos));
  },
};
