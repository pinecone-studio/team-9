"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  type LucideIcon,
  LayoutDashboard,
  Gift,
  Users,
  Settings,
  FileText,
  ClipboardList,
  Shield,
  ChevronDown,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
  Cog,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { sampleEmployees } from "@/lib/data";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
};

const employeeNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "benefits", label: "My Benefits", icon: Gift },
];

const hrNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "employees", label: "Employees", icon: Users },
  { id: "requests", label: "Requests", icon: ClipboardList, badge: true },
  { id: "catalog", label: "Benefits Catalog", icon: BookOpen },
  { id: "rules", label: "Eligibility Rules", icon: Cog },
  { id: "contracts", label: "Vendor Contracts", icon: FileText },
  { id: "audit", label: "Audit Logs", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { currentUser, setCurrentUser, viewMode, setViewMode, requests } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = viewMode === "hr_admin" ? hrNavItems : employeeNavItems;
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const handleUserSwitch = (userId: string) => {
    const user = sampleEmployees.find((e) => e.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.role === "hr_admin") {
        setViewMode("hr_admin");
      } else {
        setViewMode("employee");
      }
      onTabChange("dashboard");
    }
  };

  const toggleViewMode = () => {
    if (currentUser?.role === "hr_admin" || currentUser?.role === "finance_manager") {
      setViewMode(viewMode === "hr_admin" ? "employee" : "hr_admin");
      onTabChange("dashboard");
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Gift className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-base font-semibold text-sidebar-foreground">EBMS</h1>
                <p className="text-xs text-muted-foreground">Benefits Portal</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Collapse Button (when collapsed) */}
        {collapsed && (
          <div className="flex justify-center py-2 border-b border-sidebar-border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCollapsed(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* View Mode Toggle (for admins) */}
        {(currentUser?.role === "hr_admin" || currentUser?.role === "finance_manager") && (
          <div className={cn("border-b border-sidebar-border", collapsed ? "p-2" : "p-3")}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleViewMode}
                    className="flex w-full items-center justify-center rounded-lg bg-sidebar-accent p-2 transition-colors hover:bg-accent"
                  >
                    {viewMode === "hr_admin" ? (
                      <Shield className="h-4 w-4 text-primary" />
                    ) : (
                      <Users className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {viewMode === "hr_admin" ? "Admin View" : "Employee View"} - Click to switch
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={toggleViewMode}
                className="flex w-full items-center justify-between rounded-lg bg-sidebar-accent px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  {viewMode === "hr_admin" ? (
                    <Shield className="h-4 w-4 text-primary" />
                  ) : (
                    <Users className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sidebar-foreground font-medium">
                    {viewMode === "hr_admin" ? "Admin View" : "Employee View"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {!collapsed && (
            <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {viewMode === "hr_admin" ? "Administration" : "Navigation"}
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showBadge = item.badge && pendingCount > 0;

            const navButton = (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <div className="relative">
                  <Icon className={cn("h-[18px] w-[18px]", collapsed && "h-5 w-5")} />
                  {showBadge && collapsed && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {showBadge && (
                      <Badge
                        variant={isActive ? "secondary" : "default"}
                        className={cn(
                          "h-5 min-w-5 px-1.5 text-xs",
                          isActive ? "bg-primary-foreground/20 text-primary-foreground" : ""
                        )}
                      >
                        {pendingCount}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    {item.label}
                    {showBadge && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                        {pendingCount}
                      </Badge>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return navButton;
          })}
        </nav>

        {/* User Profile */}
        <div className={cn("border-t border-sidebar-border", collapsed ? "p-2" : "p-3")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {collapsed ? (
                <button className="flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-sidebar-accent">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {currentUser?.avatar || currentUser?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              ) : (
                <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {currentUser?.avatar || currentUser?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {currentUser?.name}
                    </p>
                    <p className="text-xs capitalize text-muted-foreground truncate">
                      {currentUser?.role.replace("_", " ")}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
              </div>
              <div className="py-1">
                <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  Switch User (Demo)
                </p>
                {sampleEmployees.map((emp) => (
                  <DropdownMenuItem
                    key={emp.id}
                    onClick={() => handleUserSwitch(emp.id)}
                    className="gap-3 py-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {emp.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{emp.name}</p>
                      <p className="text-xs text-muted-foreground capitalize truncate">
                        {emp.role.replace("_", " ")} • {emp.department}
                      </p>
                    </div>
                    {emp.id === currentUser?.id && (
                      <div className="h-2 w-2 rounded-full bg-success" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  );
}
