import {PluginCommAPI} from 'sn-plugin-lib';
import {StorageService} from './StorageService';
import {formatDate, getLocalToday} from './DateService';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function todayString(): string {
  return formatDate(getLocalToday(), 'YYYY-MM-DD');
}

// Called when user lassos handwriting and taps "Add as Todo" in the lasso toolbar.
export async function addTodoFromLasso(): Promise<void> {
  const result = await PluginCommAPI.recognizeElements();
  if (!result?.success || !result.result?.text) {
    return;
  }
  const text = result.result.text.trim();
  if (!text) {
    return;
  }
  const todos = await StorageService.loadTodos();
  todos.push({id: generateId(), text, checked: false, createdDate: todayString()});
  await StorageService.saveTodos(todos);
}

// Called when user lassos a todo line in the note TextBox and taps "Mark Done".
// Strips the leading □ prefix (U+25A2) that insertTodosAsTextBox adds.
export async function markDoneFromLasso(): Promise<void> {
  const result = await PluginCommAPI.recognizeElements();
  if (!result?.success || !result.result?.text) {
    return;
  }
  const recognized = result.result.text
    .trim()
    .replace(/^▢\s*/u, '')
    .trim();
  const todos = await StorageService.loadTodos();
  const idx = todos.findIndex(
    t =>
      !t.checked &&
      (t.text === recognized || t.text.toLowerCase() === recognized.toLowerCase()),
  );
  if (idx === -1) {
    return;
  }
  todos[idx] = {...todos[idx], checked: true};
  await StorageService.saveTodos(todos);
}
