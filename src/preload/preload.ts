import { contextBridge, ipcRenderer } from 'electron';
import type { MainElectronApi, PreloadElectronApi } from "../shared/api";

const preloadApi: PreloadElectronApi = {
  doSomethingInPreload: a => `Hello from preload, got ${a}!`,
};

const mainApi : MainElectronApi = {
  doSomethingInMain: a => ipcRenderer.send('doSomethingInMain', a),
  invokeSomethingInMain: a => ipcRenderer.invoke('invokeSomethingInMain', a),
};

contextBridge.exposeInMainWorld('electron', {
  ...preloadApi,
  ...mainApi,
});
