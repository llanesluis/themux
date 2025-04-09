"use client";

import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { ChevronUp, Clock, Ligature } from "lucide-react";
import React, { ComponentProps, use } from "react";
import { ColorTokens } from "./color-tokens";
import { Customizer } from "./customizer";
import { ControlSection } from "./customizer-controls";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ContainerWrapper } from "./wrappers";

type CollapsibleCustomizerContextProps = {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const CollapsibleCustomizerContext = React.createContext<
  CollapsibleCustomizerContextProps | undefined
>(undefined);

export function CollapsibleCustomizerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <CollapsibleCustomizerContext value={{ isExpanded, setIsExpanded }}>
      {children}
    </CollapsibleCustomizerContext>
  );
}

export function useCollapsibleCustomizer() {
  const context = use(CollapsibleCustomizerContext);

  if (!context) {
    throw Error(
      "useCollapsibleCustomizer must be used withing a 'CollapsibleCustomizerContext' provider",
    );
  }

  return context;
}

export function CollapsibleCustomizer({
  className,
  children,
}: ComponentProps<"div">) {
  const { isExpanded } = useCollapsibleCustomizer();
  const isMounted = useMounted();

  return (
    <>
      <div className={cn(className)}>{children}</div>

      <div className="@container w-full">
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <ContainerWrapper withCane className="py-2 pb-4">
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  {/* TODO: PUT THIS ON TABS ON MOBILE */}
                  <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-3">
                    {isMounted && (
                      <>
                        <ColorTokens className="max-h-74" />
                        <Customizer />
                        <section className="space-y-1.5">
                          <Label className="flex items-center gap-1 pb-2">
                            <Ligature className="size-4" /> Typography
                          </Label>

                          <ControlSection
                            title="Sans-Serif font"
                            id="sans-serif-font"
                            className="font-sans"
                          >
                            <span className="text-muted-foreground flex items-center gap-2 text-sm">
                              <Clock className="size-4" />
                              Coming soon...
                            </span>
                          </ControlSection>

                          <ControlSection
                            title="Serif font"
                            id="serif-font"
                            className="font-serif"
                          >
                            <span className="text-muted-foreground flex items-center gap-2 text-sm">
                              <Clock className="size-4" />
                              Coming soon...
                            </span>
                          </ControlSection>

                          <ControlSection
                            title="Mono font"
                            id="mono-font"
                            className="font-mono"
                          >
                            <span className="text-muted-foreground flex items-center gap-2 text-sm">
                              <Clock className="size-4" />
                              Coming soon...
                            </span>
                          </ControlSection>
                        </section>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </ContainerWrapper>
          </div>
        </div>
      </div>
    </>
  );
}

export function CollapsibleCustomizerTrigger({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const { isExpanded, setIsExpanded } = useCollapsibleCustomizer();

  return (
    <Button
      onClick={() => setIsExpanded(!isExpanded)}
      variant="ghost"
      className={cn("relative min-w-30", className)}
      {...props}
    >
      <span>{isExpanded ? "Collapse customizer" : "Expand customizer"}</span>
      <ChevronUp
        className={cn(
          "size-6 transition",
          isExpanded ? "rotate-0" : "rotate-180",
        )}
      />
      <div
        className={cn(
          "bg-primary absolute top-0 right-0 size-2 rounded-full transition-opacity duration-300 ease-in-out",
          isExpanded ? "opacity-0" : "animate-bounce opacity-100",
        )}
      />
    </Button>
  );
}
