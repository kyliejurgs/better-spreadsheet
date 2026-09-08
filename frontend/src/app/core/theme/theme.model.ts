export const THEMES = ['system', 'light', 'dark'] as const;

export type Theme = (typeof THEMES)[number];

export type ResolvedTheme = Exclude<Theme, 'system'>;
