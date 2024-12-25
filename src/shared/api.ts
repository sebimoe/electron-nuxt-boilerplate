import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron';

export interface MainElectronEventApi {
  doSomethingInMain(a: number): void;
} 

export interface MainElectronInvokeApi {
  invokeSomethingInMain(a: number): Promise<string>;
} 

export interface PreloadElectronApi {
  doSomethingInPreload(a: number): string;
}

export type MainElectronApi = MainElectronEventApi & MainElectronInvokeApi; 
export type ElectronApi = MainElectronApi & PreloadElectronApi;

type ApiHandlers<T, E> = {
  [K in keyof T]: T[K] extends (...args: infer P) => infer R
    ? (event: E, ...args: P) => R
    : never;
};

export type MainElectronEventApiHandlers = ApiHandlers<MainElectronEventApi, IpcMainEvent>;  
export type MainElectronInvokeApiHandlers = ApiHandlers<MainElectronInvokeApi, IpcMainInvokeEvent>;
