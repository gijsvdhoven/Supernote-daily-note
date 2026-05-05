export interface Todo {
  id: string;
  text: string;
  checked: boolean;
  createdDate: string; // YYYY-MM-DD
}

export interface Settings {
  folder: string;
  dateFormat: string;
  templatePath: string;
  templateName: string;
}

export interface Template {
  name: string;
  vUri: string;
  hUri: string;
}

export const DEFAULT_SETTINGS: Settings = {
  folder: 'Daily Notes',
  dateFormat: 'YYYY-MM-DD',
  templatePath: '',
  templateName: '',
};
