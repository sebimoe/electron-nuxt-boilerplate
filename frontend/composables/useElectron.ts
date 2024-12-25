import type { ElectronApi } from "../../src/shared/renderer-api";

// convenience composable

export function useElectron() : ElectronApi | undefined {
  if(import.meta.server) throw new Error("useElectron() should only be called in client-only components or in non-ssr mode.")
  return window.electron;
}