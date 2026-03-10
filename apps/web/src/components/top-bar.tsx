"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { benefits } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Bell,
  Plus,
  User,
  Gift,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TopBarProps {
  viewMode: "employee" | "hr_admin";
  onNavigate: (tab: string, params?: Record<string, string>) => void;
}

export function TopBar({ viewMode, onNavigate }: TopBarProps) {
  const { employees, requests, currentUser, auditLogs } = useAppStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const notifications = useMemo(() => {
    const items: Array<{
      id: string;
      type: "warning" | "info" | "success";
      title: string;
      description: string;
      time: Date;
      action?: { label: string; tab: string };
    }> = [];

    // Pending requests notification
    if (pendingCount > 0) {
      items.push({
        id: "pending-requests",
        type: "warning",
        title: `${pendingCount} Pending Request${pendingCount > 1 ? "s" : ""}`,
        description: "Benefit requests awaiting your review",
        time: new Date(),
        action: { label: "Review", tab: "requests" },
      });
    }

    // Attendance alerts
    const attendanceAlerts = employees.filter((e) => e.late_arrival_count >= 3);
    if (attendanceAlerts.length > 0) {
      items.push({
        id: "attendance-alerts",
        type: "warning",
        title: "Attendance Alerts",
        description: `${attendanceAlerts.length} employee${attendanceAlerts.length > 1 ? "s" : ""} approaching late arrival threshold`,
        time: new Date(),
        action: { label: "View", tab: "employees" },
      });
    }

    // Recent approvals
    const recentApprovals = auditLogs
      .filter((l) => l.action === "BENEFIT_APPROVED")
      .slice(0, 2);
    recentApprovals.forEach((log) => {
      items.push({
        id: log.id,
        type: "success",
        title: "Benefit Approved",
        description: log.details,
        time: new Date(log.timestamp),
      });
    });

    return items.slice(0, 5);
  }, [pendingCount, employees, auditLogs]);

  const searchResults = useMemo(() => {
    return {
      employees: employees.slice(0, 5),
      benefits: benefits.slice(0, 5),
    };
  }, [employees]);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground h-10 px-4 gap-3 font-normal"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search employees, benefits, requests...</span>
            <span className="sm:hidden">Search...</span>
            <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {viewMode === "hr_admin" && (
            <Button
              variant="default"
              size="sm"
              className="gap-2 shadow-sm"
              onClick={() => setOverrideModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Override</span>
            </Button>
          )}

          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h4 className="font-semibold">Notifications</h4>
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {notifications.length} new
                  </Badge>
                )}
              </div>
              <ScrollArea className="h-[320px]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="h-10 w-10 text-muted-foreground/30" />
                    <p className="mt-3 text-sm text-muted-foreground">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => {
                          if (notification.action) {
                            onNavigate(notification.action.tab);
                            setNotificationsOpen(false);
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                            notification.type === "warning"
                              ? "bg-warning/10 text-warning"
                              : notification.type === "success"
                              ? "bg-success/10 text-success"
                              : "bg-info/10 text-info"
                          )}
                        >
                          {notification.type === "warning" ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : notification.type === "success" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Bell className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(notification.time, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      {/* Global Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <Command className="border-0">
            <CommandInput placeholder="Search employees, benefits, requests..." className="h-14" />
            <CommandList className="max-h-[400px]">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Employees">
                {searchResults.employees.map((employee) => (
                  <CommandItem
                    key={employee.id}
                    className="gap-3 py-3"
                    onSelect={() => {
                      onNavigate("employees");
                      setSearchOpen(false);
                    }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {employee.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {employee.email} • {employee.department}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {employee.employment_status}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Benefits">
                {searchResults.benefits.map((benefit) => (
                  <CommandItem
                    key={benefit.id}
                    className="gap-3 py-3"
                    onSelect={() => {
                      onNavigate("catalog");
                      setSearchOpen(false);
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Gift className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{benefit.name}</p>
                      <p className="text-xs text-muted-foreground">{benefit.category}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {benefit.subsidy_percentage}% subsidy
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Create Override Modal */}
      <Dialog open={overrideModalOpen} onOpenChange={setOverrideModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Eligibility Override</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-muted-foreground">
            <p>Select an employee from the Employees page to create an eligibility override.</p>
            <Button
              className="mt-4"
              onClick={() => {
                onNavigate("employees");
                setOverrideModalOpen(false);
              }}
            >
              Go to Employees
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
