"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn, getComponentName } from "@/lib/utils";
import {
  Check,
  Clipboard,
  Fullscreen,
  Monitor,
  Smartphone,
  Tablet,
  Terminal,
} from "lucide-react";
import React from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { ComponentErrorBoundary } from "./error-boundary";
import { ExternalLink } from "./external-link";
import { Alert, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type BlockViewerContext = {
  resizablePanelRef: React.RefObject<ImperativePanelHandle> | null;
};

const BlockViewerContext = React.createContext<BlockViewerContext | null>(null);

function useBlockViewer() {
  const context = React.useContext(BlockViewerContext);
  if (!context) {
    throw new Error(
      "useBlockViewer must be used within a BlockViewerProvider.",
    );
  }
  return context;
}

function BlockViewerProvider({ children }: { children: React.ReactNode }) {
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null);

  return (
    <BlockViewerContext.Provider
      value={{
        // @ts-ignore
        resizablePanelRef,
      }}
    >
      <div
        className="group/block-view-wrapper @container flex min-w-0 flex-col items-stretch gap-4"
        style={{
          "--height": "750px",
        }}
      >
        {children}
      </div>
    </BlockViewerContext.Provider>
  );
}

export function BlockViewer({
  className,
  name,
  children,
  href,
  internalUrl,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  name: string;
  href?: string;
  internalUrl?: string;
}) {
  return (
    <BlockViewerProvider {...props}>
      <div className="overflow-clip rounded-lg border">
        <BlockViewerToolbar name={name} internalUrl={internalUrl} />
        <BlockViewerView name={name}>{children}</BlockViewerView>
      </div>
    </BlockViewerProvider>
  );
}

function BlockViewerToolbar({
  name,
  href,
  internalUrl,
}: {
  name: string;
  href?: string;
  internalUrl?: string;
}) {
  const { resizablePanelRef } = useBlockViewer();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://themux.vercel.app";

  return (
    <div className="w-full border-b px-4 py-3">
      <div className="flex flex-col items-center gap-2 text-xs font-medium lg:text-sm @lg:flex-row">
        <div className="flex w-full items-center justify-between gap-4">
          <span className="shrink-0 font-semibold">
            {getComponentName(name)}
          </span>
          <ToggleGroup
            className="ml-auto"
            type="single"
            defaultValue="100"
            onValueChange={(value) => {
              if (resizablePanelRef?.current) {
                resizablePanelRef.current.resize(parseInt(value));
              }
            }}
          >
            <ToggleGroupItem
              value="100"
              className="h-fit rounded-sm p-1"
              title="Desktop"
            >
              <Monitor className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="60"
              className="h-fit rounded-sm p-1"
              title="Tablet"
            >
              <Tablet className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="30"
              className="h-fit rounded-sm p-1"
              title="Mobile"
            >
              <Smartphone className="size-4" />
            </ToggleGroupItem>
            <Button
              size="icon"
              variant="ghost"
              className="size-fit rounded-sm p-1"
              asChild
              title="Open in New Tab"
            >
              <ExternalLink href={`${baseUrl}${internalUrl}`} showIcon>
                <span className="sr-only">Open in New Tab</span>
                <Fullscreen className="size-4" />
              </ExternalLink>
            </Button>
          </ToggleGroup>
        </div>

        <Alert className="border-primary/30 bg-primary/10 flex w-full items-center border px-4 py-1 @lg:max-w-1/3">
          <div className="pr-2">
            <Terminal className="size-4" />
          </div>

          <AlertTitle className="w-full font-mono text-xs text-pretty">
            {`pnpm dlx shadcn@latest add `}
            <span>{name}</span>
          </AlertTitle>

          <div className="ml-auto flex items-center">
            <Button
              size={"icon"}
              variant={"ghost"}
              className="relative size-4 cursor-pointer p-1"
              onClick={() =>
                copyToClipboard(`pnpm dlx shadcn@latest add ${name}`)
              }
            >
              <Clipboard
                className={cn(
                  "absolute size-4 transition duration-200",
                  isCopied ? "scale-0" : "scale-100",
                )}
              />

              <Check
                className={cn(
                  "absolute size-4 transition duration-200",
                  !isCopied ? "scale-0" : "scale-100",
                )}
              />
            </Button>
          </div>
        </Alert>
      </div>
    </div>
  );
}

function BlockViewerView({
  className,
  name,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  name: string;
  href?: string;
}) {
  const { resizablePanelRef } = useBlockViewer();

  return (
    <ComponentErrorBoundary name={name}>
      <div
        id={name}
        data-name={name.toLowerCase()}
        className={cn(
          "grid w-full scroll-mt-16 gap-4 overflow-clip",
          className,
        )}
        {...props}
      >
        <ResizablePanelGroup direction="horizontal" className="relative z-10">
          <ResizablePanel
            ref={resizablePanelRef}
            className="bg-background relative aspect-[4/2.5] border md:aspect-auto"
            defaultSize={100}
            minSize={30}
          >
            {children}
          </ResizablePanel>

          <ResizableHandle className="after:bg-border relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full after:transition-all hover:after:h-12 md:block" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </div>
    </ComponentErrorBoundary>
  );
}
