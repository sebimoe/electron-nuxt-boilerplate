import { BrowserWindow } from "electron";
import { preloadScriptAbsolutePath } from "../paths";

export function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: preloadScriptAbsolutePath
    },
  });

  win.loadURL('app-static://local');
}

