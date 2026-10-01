export enum Browser {
  Edge = 'edge',
  IE = 'ie',
  Chrome = 'chrome',
  Opera = 'opera',
  Safari = 'safari',
  Firefox = 'firefox',
  Unknown = '',
}

// NOTE: Chrome specific browsers are detected by a proprietary default plugin.
// See https://stackoverflow.com/a/17279993
const hasChromePlugin = () => {
  if (navigator?.plugins?.namedItem !== undefined) {
    const { plugins } = navigator;
    return plugins.namedItem('Chrome PDF Viewer') !== null;
  }

  return false;
};

// Credit: https://github.com/DamonOehlman/detect-browser/blob/546e6f1348375d8a486f21da07b20717267f6c49/src/index.ts#L134
export const getCurrentBrowser = (): Browser => {
  if (navigator?.userAgent !== undefined) {
    const { userAgent } = navigator;

    if (
      /Edge\/([0-9._]+)/.exec(userAgent) !== null ||
      /EdgA?\/([0-9.]+)/.exec(userAgent) !== null
    ) {
      return Browser.Edge;
    }

    if (/(?!Chrom.*OPR)Chrome\/([0-9.]+)(:?\s|$)/.exec(userAgent) !== null && hasChromePlugin()) {
      return Browser.Chrome;
    }

    if (/Firefox\/([0-9.]+)(?:\s|$)/.exec(userAgent) !== null) {
      return Browser.Firefox;
    }

    if (
      /Opera\/([0-9.]+)(?:\s|$)/.exec(userAgent) !== null ||
      /OPR\/([0-9.]+)(:?\s|$)/.exec(userAgent) !== null
    ) {
      return Browser.Opera;
    }

    if (
      /Trident\/7\.0.*rv:([0-9.]+).*\).*Gecko$/.exec(userAgent) !== null ||
      /MSIE\s([0-9.]+);.*Trident\/[4-7].0/.exec(userAgent) !== null ||
      /MSIE\s(7\.0)/.exec(userAgent) !== null
    ) {
      return Browser.IE;
    }

    if (/Version\/([0-9._]+).*Safari/.exec(userAgent) !== null) {
      return Browser.Safari;
    }
  }

  return Browser.Unknown;
};
