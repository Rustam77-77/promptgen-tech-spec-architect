import React from "react";
import { MessageSquare, Save, LayoutTemplate, Wand2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
const navItems = [
  { label: "Генератор", path: "/", icon: Wand2 },
  { label: "Сохраненные промпты", path: "/saved", icon: Save },
  { label: "Шаблоны", path: "/templates", icon: LayoutTemplate },
  { label: "ИИ Чат", path: "/ai-chat", icon: MessageSquare },
];
export function AppSidebar(): JSX.Element {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  return (
    <Sidebar className={isMobile ? "hidden" : ""}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-6">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
            <Wand2 className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">PromptGen</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="px-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path} className="mb-1">
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  className="h-11 rounded-xl px-4 transition-all"
                >
                  <Link to={item.path}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6">
        <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Android Edition</p>
          <p className="text-[10px] text-muted-foreground mt-1 opacity-60">v1.2 Material Refined</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}