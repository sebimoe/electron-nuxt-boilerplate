import type { ElectronApi } from '../../src/shared/renderer-api';

declare global {
  interface Window {
    electron?: ElectronApi;
  }
}
