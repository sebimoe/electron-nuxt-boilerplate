import path from "node:path";

const appStaticPath = 'dist/public';

export const projectRootAbsolutePath = path.resolve(import.meta.dirname, '..'); // relative to dist/
export const appStaticAbsolutePath = path.resolve(projectRootAbsolutePath, appStaticPath);
export const preloadScriptAbsolutePath = path.join(projectRootAbsolutePath, 'dist/preload.cjs');
