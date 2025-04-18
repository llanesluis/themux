"use client";

import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { Palette, X } from "lucide-react";
import * as React from "react";
import { ModeSwitcher } from "../mode-switcher";
import { TooltipWrapper } from "../tooltip-wrapper";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ColorTokens } from "./color-tokens";
import { CopyCodeButtonDialog } from "./copy-code-button-dialog";
import { CustomizerSettings } from "./customizer-settings";
import { ResetButton } from "./reset-button";
import { ThemePresets } from "./theme-presets";
import { Typography } from "./typography";

export function CustomizerSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const isMounted = useMounted();

  if (!isMounted) {
    return (
      <Sidebar className="overflow-hidden" {...props}>
        <SidebarContent className="scrollbar-thin @container relative flex max-h-svh flex-col py-2 group-data-[collapsible=icon]:invisible [&>button]:hidden">
          <div className="px-4">
            <Skeleton className="h-10" />
          </div>
          <div className="grow p-4">
            <Skeleton className="h-full" />
          </div>
          <div className="px-4">
            <Skeleton className="h-10" />
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar className="overflow-hidden" {...props}>
      <Tabs
        defaultValue="tokens"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <SidebarHeader className="px-2 pr-3 max-md:pt-2">
          <TabsList className="w-full p-1 text-xs">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="theme-presets">Presets</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>
        </SidebarHeader>

        <SidebarContent className="@container relative max-h-svh group-data-[collapsible=icon]:invisible [&>button]:hidden">
          <ScrollArea className="flex flex-col overflow-hidden pr-1">
            <div className="y-0 flex h-full flex-col gap-2 px-2">
              <TabsContent
                value="tokens"
                className="flex flex-col space-y-1.5 py-2"
              >
                <ColorTokens />
              </TabsContent>

              <TabsContent value="theme-presets" className="py-2">
                <ThemePresets />
              </TabsContent>

              <TabsContent value="typography" className="py-2">
                <Typography />
              </TabsContent>
            </div>
          </ScrollArea>
        </SidebarContent>
      </Tabs>

      <SidebarFooter>
        <div className="sticky mt-auto flex gap-2">
          <CopyCodeButtonDialog className="flex-1" />
          <TooltipWrapper label="Toggle light/dark" asChild>
            <ModeSwitcher />
          </TooltipWrapper>

          <TooltipWrapper label="Reset" asChild>
            <ResetButton />
          </TooltipWrapper>

          <TooltipWrapper label="Settings" asChild>
            <CustomizerSettings />
          </TooltipWrapper>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function CustomizerSidebarToggle({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, toggleSidebar, openMobile } = useSidebar();
  return (
    <>
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={toggleSidebar}
        className={cn("relative hidden md:inline-flex", className)}
        {...props}
      >
        <Palette
          className={cn(
            "transition duration-200",
            open ? "absolute scale-0" : "scale-100",
          )}
        />
        <X
          className={cn(
            "transition duration-200",
            !open ? "absolute scale-0" : "scale-100",
          )}
        />
        <div
          className={cn(
            "bg-primary absolute top-0 right-0 size-2 rounded-full transition-opacity duration-300 ease-in-out",
            open ? "opacity-0" : "animate-bounce opacity-100",
          )}
        />
      </Button>

      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={toggleSidebar}
        className={cn("relative inline-flex md:hidden", className)}
        {...props}
      >
        <Palette
          className={cn(
            "transition duration-200",
            openMobile ? "absolute scale-0" : "scale-100",
          )}
        />
        <X
          className={cn(
            "transition duration-200",
            !openMobile ? "absolute scale-0" : "scale-100",
          )}
        />
        <div
          className={cn(
            "bg-primary absolute top-0 right-0 size-2 rounded-full transition-opacity duration-300 ease-in-out",
            openMobile ? "opacity-0" : "animate-bounce opacity-100",
          )}
        />
      </Button>
    </>
  );
}
