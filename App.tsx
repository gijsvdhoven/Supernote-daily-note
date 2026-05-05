/**
 * Simple Plugin
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Pressable,
} from 'react-native';
import { PluginManager } from 'sn-plugin-lib';

/**
 * Plugin View
 * Displays Hello World text in the center of the screen
 */
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const handleClose = () => {
    PluginManager.closePluginView();
  };

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const closeTextStyle = [styles.closeText, { color: textColor }];
  const helloTextStyle = [styles.helloText, { color: textColor }];

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={handleClose}>
        <Text style={closeTextStyle}>✕</Text>
      </Pressable>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000000' : '#ffffff'}
      />
      <Text style={helloTextStyle}>
        Hello World
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  helloText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default App;
