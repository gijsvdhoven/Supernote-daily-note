import React, {useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {PluginManager} from 'sn-plugin-lib';
import {useSettings} from '../hooks/useSettings';
import {Settings} from '../types';

const DATE_FORMATS = ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY', 'YYYYMMDD'];

export default function SettingsScreen() {
  const {settings, templates, loading, save} = useSettings();
  const [draft, setDraft] = useState<Settings | null>(null);
  const current = draft ?? settings;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  async function handleSave() {
    await save(current);
    PluginManager.closePluginView();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daily Notes</Text>

      <Text style={styles.label}>Folder</Text>
      <TextInput
        style={styles.input}
        value={current.folder}
        onChangeText={v => setDraft({...current, folder: v})}
        placeholder="Daily Notes"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Date Format</Text>
      <View style={styles.chipRow}>
        {DATE_FORMATS.map(fmt => (
          <TouchableOpacity
            key={fmt}
            style={[styles.chip, current.dateFormat === fmt && styles.chipActive]}
            onPress={() => setDraft({...current, dateFormat: fmt})}>
            <Text
              style={[styles.chipText, current.dateFormat === fmt && styles.chipTextActive]}>
              {fmt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Template</Text>
      <View style={styles.chipRow}>
        <TouchableOpacity
          style={[styles.chip, !current.templatePath && styles.chipActive]}
          onPress={() => setDraft({...current, templatePath: '', templateName: ''})}>
          <Text style={[styles.chipText, !current.templatePath && styles.chipTextActive]}>
            None
          </Text>
        </TouchableOpacity>
        {templates.map(tpl => (
          <TouchableOpacity
            key={tpl.vUri}
            style={[styles.chip, current.templatePath === tpl.vUri && styles.chipActive]}
            onPress={() =>
              setDraft({...current, templatePath: tpl.vUri, templateName: tpl.name})
            }>
            <Text
              style={[
                styles.chipText,
                current.templatePath === tpl.vUri && styles.chipTextActive,
              ]}>
              {tpl.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  container: {padding: 28, backgroundColor: '#fff', flexGrow: 1},
  title: {fontSize: 24, fontWeight: '700', color: '#111', marginBottom: 28},
  label: {fontSize: 13, fontWeight: '600', color: '#555', marginTop: 20, marginBottom: 8},
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#fafafa',
  },
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#f5f5f5',
  },
  chipActive: {borderColor: '#222', backgroundColor: '#222'},
  chipText: {fontSize: 14, color: '#555'},
  chipTextActive: {color: '#fff'},
  saveBtn: {
    marginTop: 44,
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
