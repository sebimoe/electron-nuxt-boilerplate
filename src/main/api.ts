import { ipcMain } from "electron";
import { mainEventApi } from "./api/event";
import { mainInvokeApi } from "./api/invoke";

export function registerApiIpcHandlers() {
  for(let [name, fn] of Object.entries(mainEventApi)) {
    ipcMain.on(name, fn);
    console.debug(`[main] registered ipc event handler for "${name}"`)
  }
  for(let [name, fn] of Object.entries(mainInvokeApi)) {
    ipcMain.handle(name, fn);
    console.debug(`[main] registered ipc invoke handler for "${name}"`)
  }
}
