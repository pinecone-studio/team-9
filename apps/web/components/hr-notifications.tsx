"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { sampleContracts } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Clock,
  FileText,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Bell,
} from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";

interface HRNotificationsProps {
  onNavigate: (tab: string) => void;
}

export function HRNotifications({ onNavigate }: HRNotificationsProps) {
  const { employees, requests, auditLogs } = useAppStore();

  const notifications = useMemo(() => {
    const items: Array<{
      id: string;
      type: "critical" | "warning" | "info" | "success";
      category: string;
      title: string;
      description: string;
      timestamp: Date;
      action?: { label: string; tab: string };
    }> = [];

    // Pending requests
    const pendingRequests = requests.filter((r) => r.status === "pending");
    if (pendingRequests.length > 0) {
      items.push({
        id: "pending-requests",
        type: "warning",
        category: "Requests",
        title: `${pendingRequests.length} Benefit Request${pendingRequests.length > 1 ? "s" : ""} Pending`,
        description: "Employee benefit requests are awaiting your review and approval.",
        timestamp: new Date(),
        action: { label: "Review Requests", tab: "requests" },
      });
    }

    // Attendance violations approaching
    const attendanceAlerts = employees.filter((e) => e.late_arrival_count >= 3 && e.late_arrival_count < 5);
    if (attendanceAlerts.length > 0) {
      items.push({
        id: "attendance-alerts",
        type: "warning",
        category: "Attendance",
        title: `${attendanceAlerts.length} Employee${attendanceAlerts.length > 1 ? "s" : ""} Approaching Attendance Limit`,
        description: `These employees have 3+ late arrivals and may lose benefit eligibility if they exceed 5.`,
        timestamp: new Date(),
        action: { label: "View Employees", tab: "employees" },
      });
    }

    // Critical attendance violations
    const criticalAttendance = employees.filter((e) => e.late_arrival_count >= 5);
    if (criticalAttendance.length > 0) {
      items.push({
        id: "critical-attendance",
        type: "critical",
        category: "Attendance",
        title: `${criticalAttendance.length} Employee${criticalAttendance.length > 1 ? "s" : ""} Exceeded Attendance Limit`,
        description: "These employees have lost benefit eligibility due to attendance violations.",
        timestamp: new Date(),
        action: { label: "View Employees", tab: "employees" },
      });
    }

    // Contracts expiring soon
    const expiringContracts = sampleContracts.filter((c) => {
      const daysUntilExpiry = differenceInDays(new Date(c.expiry_date), new Date());
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    });
    if (expiringContracts.length > 0) {
      items.push({
        id: "expiring-contracts",
        type: "warning",
        category: "Contracts",
        title: `${expiringContracts.length} Contract${expiringContracts.length > 1 ? "s" : ""} Expiring Soon`,
        description: "Vendor contracts will expire within the next 30 days and need renewal.",
        timestamp: new Date(),
        action: { label: "View Contracts", tab: "contracts" },
      });
    }

    // Missing OKR submissions
    const missingOkr = employees.filter((e) => !e.okr_submitted && e.employment_status === "active");
    if (missingOkr.length > 0) {
      items.push({
        id: "missing-okr",
        type: "info",
        category: "OKR",
        title: `${missingOkr.length} Employee${missingOkr.length > 1 ? "s" : ""} Missing OKR Submission`,
        description: "These employees have not submitted their OKR and may be ineligible for certain benefits.",
        timestamp: new Date(),
        action: { label: "View Employees", tab: "employees" },
      });
    }

    // Recent audit activity
    const recentActivity: typeof items = auditLogs.slice(0, 3).map((log) => ({
      id: log.id,
      type: log.action.includes("APPROVED")
        ? "success"
        : log.action.includes("REJECTED")
        ? "warning"
        : "info",
      category: "Activity",
      title: log.action.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
      description: log.details,
      timestamp: new Date(log.timestamp),
    }));
    items.push(...recentActivity);

    return items.sort((a, b) => {
      const typeOrder = { critical: 0, warning: 1, info: 2, success: 3 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
  }, [employees, requests, auditLogs]);

  const criticalCount = notifications.filter((n) => n.type === "critical").length;
  const warningCount = notifications.filter((n) => n.type === "warning").length;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "critical":
        return {
          bg: "bg-destructive/10",
          border: "border-destructive/30",
          icon: "text-destructive",
        };
      case "warning":
        return {
          bg: "bg-warning/10",
          border: "border-warning/30",
          icon: "text-warning",
        };
      case "success":
        return {
          bg: "bg-success/10",
          border: "border-success/30",
          icon: "text-success",
        };
      default:
        return {
          bg: "bg-info/10",
          border: "border-info/30",
          icon: "text-info",
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
        <p className="mt-1 text-muted-foreground">
          System alerts and important updates requiring your attention
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className={cn(criticalCount > 0 && "border-destructive/30")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{criticalCount}</p>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={cn(warningCount > 0 && "border-warning/30")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{warningCount}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/10">
                <Bell className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{notifications.length}</p>
                <p className="text-sm text-muted-foreground">Total Notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-success/30" />
                <p className="mt-4 text-lg font-medium">All Clear</p>
                <p className="text-sm text-muted-foreground">
                  No notifications or alerts at this time
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const styles = getTypeStyles(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
                      notification.type === "critical" && "bg-destructive/5"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        styles.bg,
                        styles.icon
                      )}
                    >
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-foreground">{notification.title}</p>
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                        {notification.action && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 gap-1"
                            onClick={() => onNavigate(notification.action!.tab)}
                          >
                            {notification.action.label}
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
