/**
 * Daily Notes Plugin
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { PluginManager } from 'sn-plugin-lib';
import { checkPendingButton } from './index';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { StorageService } from './src/services/StorageService';
import { Settings } from './src/types';

type ScreenType = 'home' | 'settings';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loaded = await StorageService.loadSettings();
        setSettings(loaded);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Failed to load settings');
      }
    };
    loadSettings();
  }, []);

  // Check for pending button press (from pending button ID pattern)
  useEffect(() => {
    const timer = setInterval(() => {
      const buttonId = checkPendingButton();
      if (buttonId === 100) {
        // Main toolbar button - reset to home screen and today's date
        setCurrentScreen('home');
        setSelectedDate(new Date());
        setError(null);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    PluginManager.closePluginView();
  };

  const handleSettingsSaved = async (newSettings: Settings) => {
    try {
      await StorageService.saveSettings(newSettings);
      setSettings(newSettings);
      setCurrentScreen('home');
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings');
    }
  };

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const bgColor = isDarkMode ? '#1a1a1a' : '#ffffff';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
      />

      <Pressable style={styles.closeButton} onPress={handleClose}>
        <Text style={[styles.closeText, { color: textColor }]}>✕</Text>
      </Pressable>

      {error && (
        <View style={[styles.errorBanner, { backgroundColor: '#ffcccc' }]}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => setError(null)}>
            <Text style={styles.errorClose}>×</Text>
          </Pressable>
        </View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={textColor} />
          <Text style={[styles.loadingText, { color: textColor }]}>Opening note...</Text>
        </View>
      )}

      {settings && !loading && currentScreen === 'home' && (
        <HomeScreen
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onOpenNote={async (date) => {
            try {
              setLoading(true);
              const { NoteService } = await import('./src/services/NoteService');
              await NoteService.openOrCreateNote(date);
            } catch (err) {
              console.error('Failed to open note:', err);
              setError('Failed to open note. Check logs.');
            } finally {
              setLoading(false);
            }
          }}
          onSettingsPress={() => setCurrentScreen('settings')}
          settings={settings}
        />
      )}

      {settings && !loading && currentScreen === 'settings' && (
        <SettingsScreen
          initialSettings={settings}
          onSave={handleSettingsSaved}
          onBack={() => setCurrentScreen('home')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 20,
    marginHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#cc0000',
    flex: 1,
    fontSize: 14,
  },
  errorClose: {
    color: '#cc0000',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
