"use client";

import { useSettings } from "@/hooks/use-settings";
import { useThemeConfig } from "@/hooks/use-theme-config";
import { ColorProperty, ThemeMode } from "@/types/theme";
import { convertToHex, convertToOklch } from "@/utils/color-converter";
import { getOptimalForegroundColor } from "@/utils/colors";
import { CircleAlert, Pipette } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useDebouncedCallback } from "../hooks/use-debounced-callback";
import { PasteColorControl } from "./customizer-controls";
import { ComponentErrorBoundary } from "./error-boundary";
import { TokenDisplay, TokenInfo } from "./token";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface TokenColorPickerProps {
  colorProperty: ColorProperty;
  color: string;
  syncModes?: boolean;
  setColorTokens: (obj: {
    property: ColorProperty;
    color: string;
    modesInSync?: boolean;
  }) => void;
}

export function TokenColorPicker({
  colorProperty,
  color,
  syncModes,
  setColorTokens,
}: TokenColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color);
  const hexColor = convertToHex(color);
  const { modesInSync } = useSettings();

  const resolvedModesInSync = syncModes !== undefined ? syncModes : modesInSync; // allows overriding the global sync mode

  useEffect(() => {
    if (currentColor !== color) setCurrentColor(color);
  }, [color]);

  const debouncedSetColorTokens = useDebouncedCallback(setColorTokens, 100);

  const handleColorChange = useCallback(
    (color: string) => {
      const newOklchColor = convertToOklch(color);
      setCurrentColor(newOklchColor);
      debouncedSetColorTokens({
        color: newOklchColor,
        modesInSync: resolvedModesInSync,
        property: colorProperty,
      });
    },
    [resolvedModesInSync, colorProperty],
  );

  return (
    <ComponentErrorBoundary
      name="TokenColorPicker"
      fallback={<ColorPickerErrorFallback />}
    >
      <Popover>
        <div className="flex items-center gap-2">
          <PopoverTrigger className="relative cursor-pointer">
            <TokenDisplay color={color} />
            <Pipette
              className="text-foreground fill-foreground absolute inset-0 m-auto size-4"
              style={{
                "--foreground": getOptimalForegroundColor(currentColor),
              }}
            />
          </PopoverTrigger>
          <TokenInfo colorProperty={colorProperty} color={color} />
        </div>

        <PopoverContent className="flex size-fit gap-6 p-4" align="start">
          <div className="space-y-2">
            <HexColorPicker color={hexColor} onChange={handleColorChange} />
            <ColorOklchValue currentColor={currentColor} />
            <PasteColorControl
              modesInSync={resolvedModesInSync}
              setColorTokens={debouncedSetColorTokens}
              property={colorProperty}
              className="w-50"
            />
          </div>
        </PopoverContent>
      </Popover>
    </ComponentErrorBoundary>
  );
}

function ColorOklchValue({ currentColor }: { currentColor: string }) {
  return (
    <div className="flex items-center gap-1">
      <div
        className="bg-primary size-2 rounded-full"
        style={{
          "--primary": currentColor,
        }}
      />
      <p className="text-muted-foreground font-mono text-xs">{currentColor}</p>
    </div>
  );
}

// Error fallback to prevent *shittier* experiences, for the moment
function ColorPickerErrorFallback() {
  const { currentThemeObject } = useThemeConfig();
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <div className="relative cursor-pointer">
        <TokenDisplay
          color={currentThemeObject[resolvedTheme as ThemeMode].destructive!}
        />
        <CircleAlert className="absolute inset-0 m-auto size-4 text-neutral-50" />
      </div>

      <div>
        <p className="text-destructive font-mono text-xs font-semibold">
          Error occurred. I'm sorry :/
        </p>
        <p className="text-destructive/70 truncate font-mono text-xs">
          For now, refresh the page.
        </p>
      </div>
    </div>
  );
}
