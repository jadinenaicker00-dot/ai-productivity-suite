import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, BookOpenText, MessagesSquare, BrainCircuit } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Research Assistant", url: "/research", icon: BookOpenText },
  { title: "Workplace Chat", url: "/chat", icon: MessagesSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (router) => router.location.pathname });

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <BrainCircuit className="size-5" aria-hidden="true" />
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold text-sidebar-foreground">
                Workplace AI
              </span>
              <span className="text-xs text-muted-foreground">Productivity Assistant</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="p-4">
          <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/70 p-3">
            <p className="text-xs font-semibold text-sidebar-accent-foreground">Demo workspace</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Sample outputs are shown so you can explore every feature without setup.
            </p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
