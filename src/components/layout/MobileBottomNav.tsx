import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Save, LayoutTemplate, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
const navItems = [
  { label: "Генератор", path: "/", icon: Wand2 },
  { label: "Шаблоны", path: "/templates", icon: LayoutTemplate },
  { label: "Библиотека", path: "/saved", icon: Save },
  { label: "Чат", path: "/ai-chat", icon: MessageSquare },
];
export function MobileBottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 group outline-none"
            >
              <div
                className={cn(
                  "relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-200 ripple-effect",
                  isActive ? "bg-primary/20 text-primary" : "text-muted-foreground group-active:bg-muted"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}