// Do not import anything here without checking if you need to update the rspack config for the coreUtilities component.

import { arrayIncludes } from "@rbx/core-lib";
import { AppTheme, AgeTheme, appThemes, ageThemes, Theme } from "./constants";

const appThemeClass = (theme: AppTheme) => `${theme}-theme`;
const ageThemeClass = (theme: AgeTheme) => `age-${theme}-theme`;
const themeClass = (theme: Theme) =>
	arrayIncludes(ageThemes, theme) ? ageThemeClass(theme) : appThemeClass(theme);

const { classList } = document.body;

const initialTheme = () => {
	if (classList.contains("age-kids-variant1-theme")) {
		// TODO: remove after IXP is done
		return "kids";
	}
	return (
		ageThemes.find((theme) => classList.contains(ageThemeClass(theme))) ??
		appThemes.find((theme) => classList.contains(appThemeClass(theme))) ??
		"default"
	);
};

let accountTheme: Theme = initialTheme();
let previewTheme: AppTheme | null = null;

const clearTheme = () => {
	classList.remove(themeClass(previewTheme ?? accountTheme));
};

/** Returns the currently stored account level theme in memory. */
export const getTheme = (): Theme => accountTheme;

/** Sets the currently stored account level theme in memory (does not persist). */
export const setTheme = (theme: AppTheme) => {
	if (previewTheme == null) {
		clearTheme();
		classList.add(appThemeClass(theme));
	}
	accountTheme = theme;
};

/** Returns the current app theme being previewed, if any. */
export const getPreviewTheme = (): AppTheme | null => previewTheme;

/** Sets the app theme to preview on the page. */
export const setPreviewTheme = (theme: AppTheme) => {
	clearTheme();
	classList.add(appThemeClass(theme));
	previewTheme = theme;
};

/** Clears the theme being previewed and restores the page to the account level theme. */
export const clearPreviewTheme = () => {
	clearTheme();
	classList.add(themeClass(accountTheme));
	previewTheme = null;
};

export type { Theme, AppTheme, AgeTheme };
