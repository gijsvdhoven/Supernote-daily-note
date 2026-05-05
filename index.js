import {AppRegistry, Image} from 'react-native';
import {PluginManager} from 'sn-plugin-lib';
import App from './App';
import {name as appName} from './app.json';
import {BUTTON_IDS} from './src/constants/ButtonIds';
import {NoteService} from './src/services/NoteService';
import {addTodoFromLasso, markDoneFromLasso} from './src/services/TodoService';
import {getLocalToday} from './src/services/DateService';

AppRegistry.registerComponent(appName, () => App);

PluginManager.init();

PluginManager.registerButton(1, ['NOTE'], {
  id: BUTTON_IDS.TODAY,
  name: 'Today',
  icon: Image.resolveAssetSource(require('./assets/icons/today.png')).uri,
  expandButton: 0,
});

PluginManager.registerButton(1, ['NOTE'], {
  id: BUTTON_IDS.PREV_DAY,
  name: 'Previous Day',
  icon: Image.resolveAssetSource(require('./assets/icons/prev.png')).uri,
  expandButton: 0,
});

PluginManager.registerButton(1, ['NOTE'], {
  id: BUTTON_IDS.NEXT_DAY,
  name: 'Next Day',
  icon: Image.resolveAssetSource(require('./assets/icons/next.png')).uri,
  expandButton: 0,
});

PluginManager.registerButton(2, ['NOTE'], {
  id: BUTTON_IDS.ADD_AS_TODO,
  name: 'Add as Todo',
  icon: Image.resolveAssetSource(require('./assets/icons/add_todo.png')).uri,
  expandButton: 0,
});

PluginManager.registerButton(2, ['NOTE'], {
  id: BUTTON_IDS.MARK_DONE,
  name: 'Mark Done',
  icon: Image.resolveAssetSource(require('./assets/icons/mark_done.png')).uri,
  expandButton: 0,
});

PluginManager.registerConfigButton();

PluginManager.registerButtonListener(async buttonId => {
  switch (buttonId) {
    case BUTTON_IDS.TODAY:
      await NoteService.openOrCreateNote(getLocalToday());
      break;
    case BUTTON_IDS.PREV_DAY:
      await NoteService.navigateRelative(-1);
      break;
    case BUTTON_IDS.NEXT_DAY:
      await NoteService.navigateRelative(1);
      break;
    case BUTTON_IDS.ADD_AS_TODO:
      await addTodoFromLasso();
      break;
    case BUTTON_IDS.MARK_DONE:
      await markDoneFromLasso();
      break;
  }
});

PluginManager.registerConfigButtonListener(() => {
  PluginManager.showPluginView();
});
