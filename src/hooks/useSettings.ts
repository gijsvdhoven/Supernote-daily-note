import {useState, useEffect} from 'react';
import {PluginCommAPI} from 'sn-plugin-lib';
import {StorageService} from '../services/StorageService';
import {Settings, Template, DEFAULT_SETTINGS} from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      StorageService.loadSettings(),
      PluginCommAPI.getNoteSystemTemplates().catch(() => [] as Template[]),
    ]).then(([s, t]) => {
      setSettings(s);
      setTemplates(t ?? []);
      setLoading(false);
    });
  }, []);

  async function save(next: Settings): Promise<void> {
    await StorageService.saveSettings(next);
    setSettings(next);
  }

  return {settings, templates, loading, save};
}
