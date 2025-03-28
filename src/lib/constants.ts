import { Blocks, Component, Home, Ligature, Palette } from "lucide-react";

export const ACTIVE_THEME_NAME_COOKIE = "active_theme_name";
export const ACTIVE_THEME_RADIUS_COOKIE = "active_theme_radius";
export const ACTIVE_THEME_OBJECT_COOKIE = "active_theme_object";
export const ACTIVE_THEME_CONFIG_COOKIE = "active_theme_config";

export const NAV_LINKS = [
  { href: "/shadcn-themes", title: "Theme customizer", icon: Palette },
  { href: "/shadcn-themes/components", title: "Components", icon: Component },
  { href: "/shadcn-themes/blocks", title: "Blocks", icon: Blocks },
  { href: "/shadcn-themes/fonts", title: "Fonts", icon: Ligature },
];
