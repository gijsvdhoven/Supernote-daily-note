// Type declarations for sn-plugin-lib (Supernote plugin SDK).
// Used by TypeScript when the package is not installed (e.g. in CI).
// When the real package is present its own types take precedence.
declare module 'sn-plugin-lib' {
  interface ButtonConfig {
    id: number;
    name: string;
    icon: string;
    expandButton: number;
  }

  export const PluginManager: {
    init(): void;
    registerButton(type: number, appTypes: string[], button: ButtonConfig): void;
    registerButtonListener(cb: (buttonId: number) => void | Promise<void>): void;
    registerConfigButton(): void;
    registerConfigButtonListener(cb: () => void): void;
    showPluginView(): void;
    closePluginView(): void;
  };

  export const PluginCommAPI: {
    getCurrentFilePath(): Promise<string | null>;
    getNoteSystemTemplates(): Promise<Array<{name: string; vUri: string; hUri: string}>>;
    recognizeElements(): Promise<{
      success: boolean;
      result?: {text?: string};
    } | null>;
  };

  export const PluginFileAPI: {
    createNote(opts: {
      notePath: string;
      template: string;
      mode: number;
      isPortrait: boolean;
    }): Promise<boolean | {success: boolean}>;
  };

  export const PluginNoteAPI: {
    insertTextBox(
      notePath: string,
      page: number,
      data: {
        text: string;
        x: number;
        y: number;
        width: number;
        height: number;
        fontSize: number;
      },
    ): Promise<void>;
  };

  export const FileUtils: {
    getExternalDirPath(): Promise<string[] | null>;
    exists(path: string): Promise<boolean>;
    makeDir(path: string): Promise<void>;
    openFilePath(path: string): Promise<void>;
  };
}
