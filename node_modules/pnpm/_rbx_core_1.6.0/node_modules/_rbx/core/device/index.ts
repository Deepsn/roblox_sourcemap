import { getCurrentBrowser, Browser } from './browser';

export { getCurrentBrowser, Browser };

export enum Platform {
  Windows,
  macOS,
  Linux,
  Unix,
  iOS,
  Android,
  Unknown,
}

// credit: https://medium.com/@justenphelps/mobile-os-detection-1f14b46565cc
export function getCurrentPlatform() {
  if (typeof navigator !== 'undefined') {
    const { platform } = navigator;

    if (platform.includes('Win')) {
      return Platform.Windows;
    }

    if (platform.includes('Mac')) {
      return Platform.macOS;
    }

    if (platform.includes('Linux')) {
      return Platform.Linux;
    }

    if (platform.includes('X11')) {
      return Platform.Unix;
    }

    if (platform.includes('iPhone')) {
      return Platform.iOS;
    }

    if (platform.includes('Android')) {
      return Platform.Android;
    }

    return Platform.Unknown;
  }

  // on server side
  return null;
}

export default {
  Browser,
  getCurrentBrowser,
  getCurrentPlatform,
};
