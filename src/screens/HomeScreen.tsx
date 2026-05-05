import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useColorScheme,
} from 'react-native';
import { formatDate, addDays, getLocalToday, getDayOffset } from '../services/DateService';
import { Settings } from '../types';

interface HomeScreenProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onOpenNote: (date: Date) => Promise<void>;
  onSettingsPress: () => void;
  settings: Settings;
}

export default function HomeScreen({
  selectedDate,
  onDateChange,
  onOpenNote,
  onSettingsPress,
  settings,
}: HomeScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const buttonBgColor = isDarkMode ? '#333333' : '#f0f0f0';
  const buttonTextColor = isDarkMode ? '#ffffff' : '#000000';

  const formattedDate = formatDate(selectedDate, settings.dateFormat);
  const offset = getDayOffset(selectedDate);

  let dateLabel = formattedDate;
  if (offset === 0) {
    dateLabel = `Today (${formattedDate})`;
  } else if (offset === 1) {
    dateLabel = `Tomorrow (${formattedDate})`;
  } else if (offset === -1) {
    dateLabel = `Yesterday (${formattedDate})`;
  } else if (offset > 0) {
    dateLabel = `In ${offset} days (${formattedDate})`;
  } else {
    dateLabel = `${-offset} days ago (${formattedDate})`;
  }

  const handlePreviousDay = () => {
    onDateChange(addDays(selectedDate, -1));
  };

  const handleToday = () => {
    onDateChange(getLocalToday());
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const handleOpenNote = async () => {
    await onOpenNote(selectedDate);
  };

  return (
    <View style={[styles.container, { paddingTop: 60 }]}>
      {/* Date Display */}
      <View style={styles.dateSection}>
        <Text style={[styles.dateLabel, { color: textColor }]}>
          {dateLabel}
        </Text>
      </View>

      {/* Date Navigation */}
      <View style={styles.navigationSection}>
        <Pressable
          style={[styles.navButton, { backgroundColor: buttonBgColor }]}
          onPress={handlePreviousDay}
        >
          <Text style={[styles.navButtonText, { color: buttonTextColor }]}>
            ← Prev
          </Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, { backgroundColor: buttonBgColor }]}
          onPress={handleToday}
        >
          <Text style={[styles.navButtonText, { color: buttonTextColor }]}>
            Today
          </Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, { backgroundColor: buttonBgColor }]}
          onPress={handleNextDay}
        >
          <Text style={[styles.navButtonText, { color: buttonTextColor }]}>
            Next →
          </Text>
        </Pressable>
      </View>

      {/* Main Action Button */}
      <View style={styles.actionSection}>
        <Pressable
          style={[styles.mainButton, { backgroundColor: '#4CAF50' }]}
          onPress={handleOpenNote}
        >
          <Text style={styles.mainButtonText}>Open / Create Note</Text>
        </Pressable>
      </View>

      {/* Settings Button */}
      <View style={styles.footerSection}>
        <Pressable
          style={[styles.secondaryButton, { backgroundColor: buttonBgColor }]}
          onPress={onSettingsPress}
        >
          <Text style={[styles.secondaryButtonText, { color: buttonTextColor }]}>
            ⚙️ Settings
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navigationSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 40,
    justifyContent: 'center',
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionSection: {
    marginBottom: 40,
  },
  mainButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerSection: {
    marginTop: 'auto',
    marginBottom: 40,
  },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
