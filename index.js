/**
 * @format
 */

import {AppRegistry, Image} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { PluginManager } from 'sn-plugin-lib';

AppRegistry.registerComponent(appName, () => App);

// Pending button ID pattern: store button press events to be consumed by App.tsx
let pendingButtonId = null;

export function checkPendingButton() {
  const id = pendingButtonId;
  pendingButtonId = null;
  return id;
}

PluginManager.init();

// Main toolbar button - opens the plugin UI
PluginManager.registerButton(1, ['NOTE', 'DOC'], {
  id: 100,
  name: JSON.stringify({ en: 'Daily Notes' }),
  icon: Image.resolveAssetSource(
    require('./assets/icon.png'),
  ).uri,
  showType: 1,
});

// Optional: Register button listeners after App mounts
PluginManager.registerButtonListener((event) => {
  pendingButtonId = event.id;
});
