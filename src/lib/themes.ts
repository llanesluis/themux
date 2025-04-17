import {
  OklchValue,
  RemValue,
  ThemeConfig,
  ThemeProperties,
} from "@/types/theme";
import { basePresetsV4 } from "./colors";

export function getCssVarsFromThemeObject(
  themeProperties: Partial<ThemeProperties>,
) {
  const cssVars = {} as Record<string, OklchValue | RemValue | string>;

  for (const [key, value] of Object.entries(themeProperties)) {
    cssVars[`--${key}`] = value;
  }

  return cssVars;
}

// from  @node_modules/tailwindcss/theme.css
export const DEFAULT_FONTS = {
  "font-sans": `ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji'`,
  "font-serif": `ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif`,
  "font-mono": `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace`,
};

// from  @node_modules/tailwindcss/theme.css
// --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
export const DEFAULT_SHADOWS = {
  "shadow-color": `hsl(0 0% 0%)`, // Base color from rgb(0 0 0 / 0.1)
  "shadow-opacity": `0.1`, // Opacity from rgb(0 0 0 / 0.1)
  "shadow-blur": `3px`, // Blur radius
  "shadow-spread": `0px`, // Spread radius
  "shadow-offset-x": `0`, // X offset
  "shadow-offset-y": `1px`, // Y offset
};

export const initialThemeConfig: ThemeConfig = {
  radius: "0.625rem",
  surface: "default",
  fonts: { ...DEFAULT_FONTS, ...basePresetsV4.neutral.fonts },
  themeObject: {
    ...basePresetsV4.neutral,
    light: {
      ...basePresetsV4.neutral.light,
      ...DEFAULT_SHADOWS,
    },
    dark: {
      ...basePresetsV4.neutral.dark,
      "shadow-color": DEFAULT_SHADOWS["shadow-color"],
    },
  },
};
