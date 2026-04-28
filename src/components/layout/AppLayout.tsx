import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
type AppLayoutProps = {
  children?: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const content = children ?? <Outlet />;
  const isMobile = useIsMobile();
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className={className}>
        {/* Hide trigger on mobile as we use BottomNav */}
        {!isMobile && (
          <div className="absolute left-2 top-2 z-20">
            <SidebarTrigger />
          </div>
        )}
        <main className={isMobile ? "pb-20" : ""}>
          {container ? (
            <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12" + (contentClassName ? ` ${contentClassName}` : "")}>
              {content}
            </div>
          ) : (
            content
          )}
        </main>
        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}