import React from "react";
import { Home, MessageSquare, Save, LayoutTemplate, Wand2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
const navItems = [
  { label: "Generator", path: "/", icon: Wand2 },
  { label: "Saved Prompts", path: "/saved", icon: Save },
  { label: "Templates", path: "/templates", icon: LayoutTemplate },
  { label: "AI Chat", path: "/ai-chat", icon: MessageSquare },
];
export function AppSidebar(): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-500 to-emerald-500" />
          <span className="text-sm font-bold">PromptGen</span>
        </div>
        <div className="px-2 mt-2">
          <SidebarInput placeholder="Quick search..." />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={pathname === item.path}>
                  <Link to={item.path}>
                    <item.icon className="w-4 h-4" /> 
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-4 border-t">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Tech Spec Architect v1.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}