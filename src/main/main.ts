import 'electron-squirrel-startup'; // handle first/update startup

import { app, BrowserWindow, session } from 'electron';
import { registerProtocolSchemes, registerProtocolHandlers } from './protocols';
import { createMainWindow } from './main-window';
import { registerApiIpcHandlers } from './api';

registerProtocolSchemes();

app.whenReady().then(() => {
  registerProtocolHandlers();
  registerApiIpcHandlers();
  createMainWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
