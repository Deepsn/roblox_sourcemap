/* The list of themes user can switch to. */
export const appThemes = [
	"default",
	"emerald",
	"peridot",
	"ruby",
	"rose",
	"amethyst",
] as const;

/* The list of themes user can switch to. */
export type AppTheme = (typeof appThemes)[number];

/* The list of themes related to age and verification. */
export const ageThemes = ["kids", "startmode"] as const;

/* The list of themes related to age and verification. */
export type AgeTheme = (typeof ageThemes)[number];

/* The list of all possible themes (including those forced upon the user like `kids`). */
export const themes = [...appThemes, ...ageThemes] as const;

/* The list of all possible themes (including those forced upon the user like `kids`). */
export type Theme = (typeof themes)[number];
