"use client";

import { initialThemeConfig } from "@/lib/themes";
import { monoFontsArray, sansFontsArray, serifFontsArray } from "@/utils/fonts";
import { useTheme } from "next-themes";
import { preconnect } from "react-dom";

const THEME_CONFIG_KEY_LS = "theme-config";

export function LoadTheme() {
  const nextThemes = useTheme();
  preconnect("https://fonts.gstatic.com", { crossOrigin: "anonymous" });
  preconnect("https://fonts.googleapis.com", { crossOrigin: "anonymous" });

  const loadThemeScriptContent = `(function() {
    const root = document.documentElement;

    const defaultLightStyles = ${JSON.stringify(
      initialThemeConfig.themeObject.light,
    )};
    const defaultDarkStyles = ${JSON.stringify(
      initialThemeConfig.themeObject.dark,
    )};
    const defaultRadius = ${JSON.stringify(initialThemeConfig.radius)};
    const defaultFonts = ${JSON.stringify(initialThemeConfig.fonts)};

    let themeConfig = null;
    try {
      const persistedThemeConfig = localStorage.getItem("${THEME_CONFIG_KEY_LS}");
      if (persistedThemeConfig) {
        const parsedThemeConfig = JSON.parse(persistedThemeConfig);
        themeConfig = parsedThemeConfig;
      }
    } catch (e) {
      console.warn(
        "Theme initialization: Failed to read/parse localStorage:",
        e,
      );
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const mode = ${JSON.stringify(nextThemes?.resolvedTheme)} ?? (prefersDark ? "dark" : "light");

    const activeThemeObjectStyles =
      mode === "dark"
        ? themeConfig?.themeObject.dark || defaultDarkStyles
        : themeConfig?.themeObject.light || defaultLightStyles;

    const activeRadius = themeConfig?.radius || defaultRadius;

    const activeFonts = {
      sans: themeConfig?.fonts?.sans ?? defaultFonts.sans,
      serif: themeConfig?.fonts?.serif ?? defaultFonts.serif,
      mono: themeConfig?.fonts?.mono ?? defaultFonts.mono,
    };

    const themeProperties = {
      ...activeThemeObjectStyles,
      radius: activeRadius,
      "font-sans": activeFonts.sans,
      "font-serif": activeFonts.serif,
      "font-mono": activeFonts.mono,
    };

    let cssVars = [];
    for (const [key, value] of Object.entries(themeProperties)) {
      cssVars[\`--\${key}\`] = value;
    }

    // Function to fetch fonts up-front for the initial load
    const loadFont = (href) => {
      if (href) {
        const link = document.createElement("link");
        link.href = href;
        link.rel = "stylesheet";
        link.precedence = "high";
        document.head.appendChild(link);
      }
    };

    const activeFontSansHref = [...${JSON.stringify(sansFontsArray)}, ...${JSON.stringify(serifFontsArray)}].find(
        (font) => font.value === activeFonts.sans,
      )?.href
    const activeFontSerifHref = ${JSON.stringify(serifFontsArray)}.find(
        (font) => font.value === activeFonts.serif,
      )?.href;
    const activeFontMonoHref = ${JSON.stringify(monoFontsArray)}.find(
        (font) => font.value === activeFonts.mono,
      )?.href;

    loadFont(activeFontSansHref);
    loadFont(activeFontSerifHref);
    loadFont(activeFontMonoHref);

    // Set the CSS variables on the root element
    console.log("Theme initialization. CSS variables set:", cssVars);
    for (const [key, value] of Object.entries(cssVars)) {
      root.style.setProperty(key, value);
    }
  })()`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: loadThemeScriptContent }}
      suppressHydrationWarning
    />
  );
}
