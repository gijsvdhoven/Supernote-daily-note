import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  Pressable,
} from 'react-native';
import { PluginCommAPI } from 'sn-plugin-lib';
import { Settings, Template } from '../types';

const DATE_FORMATS = ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY', 'YYYYMMDD'];

interface SettingsScreenProps {
  initialSettings: Settings;
  onSave: (settings: Settings) => Promise<void>;
  onBack: () => void;
}

export default function SettingsScreen({
  initialSettings,
  onSave,
  onBack,
}: SettingsScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [draft, setDraft] = useState<Settings>(initialSettings);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const result = await PluginCommAPI.getNoteSystemTemplates();
        if (result && Array.isArray(result)) {
          setTemplates(result);
        }
      } catch (err) {
        console.error('Failed to load templates:', err);
      }
    };
    loadTemplates();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(draft);
      setSaveMessage('Settings saved!');
      setTimeout(() => {
        setSaveMessage(null);
        onBack();
      }, 1000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setSaveMessage('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDarkMode ? '#1a1a1a' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#111111';
  const labelColor = isDarkMode ? '#cccccc' : '#555555';
  const inputBgColor = isDarkMode ? '#2a2a2a' : '#fafafa';
  const inputBorderColor = isDarkMode ? '#444444' : '#d0d0d0';
  const buttonBgColor = isDarkMode ? '#333333' : '#222222';

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: bgColor, paddingTop: 60 }]}
    >
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={[styles.backButton, { color: textColor }]}>← Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      </View>

      <Text style={[styles.label, { color: labelColor }]}>Folder Name</Text>
      <TextInput
        style={[styles.input, { backgroundColor: inputBgColor, borderColor: inputBorderColor, color: textColor }]}
        value={draft.folder}
        onChangeText={(v) => setDraft({ ...draft, folder: v })}
        placeholder="Daily Notes"
        placeholderTextColor={labelColor}
        autoCapitalize="words"
        autoCorrect={false}
        editable={!loading}
      />

      <Text style={[styles.label, { color: labelColor }]}>Date Format</Text>
      <View style={styles.chipRow}>
        {DATE_FORMATS.map((fmt) => (
          <TouchableOpacity
            key={fmt}
            style={[
              styles.chip,
              {
                borderColor: draft.dateFormat === fmt ? buttonBgColor : inputBorderColor,
                backgroundColor: draft.dateFormat === fmt ? buttonBgColor : inputBgColor,
              },
            ]}
            onPress={() => setDraft({ ...draft, dateFormat: fmt })}
            disabled={loading}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: draft.dateFormat === fmt ? '#ffffff' : labelColor,
                },
              ]}
            >
              {fmt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: labelColor }]}>Template</Text>
      <View style={styles.chipRow}>
        <TouchableOpacity
          style={[
            styles.chip,
            {
              borderColor: !draft.templatePath ? buttonBgColor : inputBorderColor,
              backgroundColor: !draft.templatePath ? buttonBgColor : inputBgColor,
            },
          ]}
          onPress={() => setDraft({ ...draft, templatePath: '', templateName: '' })}
          disabled={loading}
        >
          <Text
            style={[
              styles.chipText,
              {
                color: !draft.templatePath ? '#ffffff' : labelColor,
              },
            ]}
          >
            None
          </Text>
        </TouchableOpacity>
        {templates.map((tpl) => (
          <TouchableOpacity
            key={tpl.vUri}
            style={[
              styles.chip,
              {
                borderColor: draft.templatePath === tpl.vUri ? buttonBgColor : inputBorderColor,
                backgroundColor: draft.templatePath === tpl.vUri ? buttonBgColor : inputBgColor,
              },
            ]}
            onPress={() =>
              setDraft({ ...draft, templatePath: tpl.vUri, templateName: tpl.name })
            }
            disabled={loading}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: draft.templatePath === tpl.vUri ? '#ffffff' : labelColor,
                },
              ]}
            >
              {tpl.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {saveMessage && (
        <Text style={[styles.message, { color: saveMessage.includes('Failed') ? '#ff6666' : '#66bb6a' }]}>
          {saveMessage}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: buttonBgColor, opacity: loading ? 0.6 : 1 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.saveBtnText}>Save Settings</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    marginTop: 40,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
