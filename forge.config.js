import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const fileWhitelist = [
  '/package.json',
  '/node_modules',
  '/dist',
];

export const packagerConfig = {
  asar: true,
  ignore: (file) => {
    if(!file) return false;

    const ignore = !fileWhitelist.some(x => x.substring(0, file.length) === file.substring(0, x.length));

    // generate debug file lists:
    // fs.writeFileSync(ignore ? 'ignored.txt' : 'included.txt', JSON.stringify(file) + "\n", { flag: 'a' })
    
    return ignore;
  }
};

export const rebuildConfig = {};

export const makers = [
  {
    name: '@electron-forge/maker-squirrel',
    config: {},
  },
  {
    name: '@electron-forge/maker-zip',
    platforms: ['darwin'],
  },
  {
    name: '@electron-forge/maker-deb',
    config: {},
  },
  {
    name: '@electron-forge/maker-rpm',
    config: {},
  },
];

export const plugins = [
  {
    name: '@electron-forge/plugin-auto-unpack-natives',
    config: {},
  },
  // Fuses are used to enable/disable various Electron functionality
  // at package time, before code signing the application
  new FusesPlugin({
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableCookieEncryption]: true,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
  }),
];
