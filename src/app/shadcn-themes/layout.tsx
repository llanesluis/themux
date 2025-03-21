import { AppSidebar } from "@/components/app-sidebar";
import { ModeSwitcher } from "@/components/mode-switcher";
import { ThemeSelector } from "@/components/theme-selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import MainNavigation from "./navigation";

export default async function ShadcnThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="relative max-h-screen overflow-hidden peer-data-[variant=inset]:max-h-[calc(100vh-1rem)]">
        <header className="sticky inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
          <div className="flex h-14 w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1.5" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <MainNavigation />
            <div className="ml-auto flex items-center gap-2">
              <ThemeSelector />
              <ModeSwitcher />
            </div>
          </div>
        </header>
        <ScrollArea className="overflow-hidden">{children}</ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
