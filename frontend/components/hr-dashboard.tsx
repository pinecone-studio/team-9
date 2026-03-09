"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { sampleContracts, benefits } from "@/lib/data";
import { evaluateBenefitEligibility } from "@/lib/rule-engine";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowRight,
  Users,
  Gift,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Upload,
  Shield,
  Calendar,
} from "lucide-react";

interface HRDashboardProps {
  onNavigate: (tab: string) => void;
}

export function HRDashboard({ onNavigate }: HRDashboardProps) {
  const { employees, requests, auditLogs } = useAppStore();

  const stats = useMemo(() => {
    const pendingRequests = requests.filter((r) => r.status === "pending").length;
    const activeContracts = sampleContracts.filter(
      (c) => new Date(c.expiry_date) > new Date()
    ).length;
    
    let totalEligible = 0;
    employees.forEach((employee) => {
      benefits.forEach((benefit) => {
        const eligibility = evaluateBenefitEligibility(employee, benefit);
        if (eligibility.status === "ELIGIBLE" || eligibility.status === "ACTIVE") {
          totalEligible++;
        }
      });
    });

    const overridesActive = auditLogs.filter(
      (l) => l.action === "ELIGIBILITY_OVERRIDE"
    ).length;

    const recentActions = auditLogs.filter(
      (l) => new Date(l.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      totalEmployees: employees.length,
      pendingRequests,
      activeContracts,
      totalEligible,
      overridesActive,
      recentActions,
    };
  }, [employees, requests, auditLogs]);

  const pendingRequests = useMemo(() => {
    return requests.filter((r) => r.status === "pending").slice(0, 4);
  }, [requests]);

  const recentLogs = useMemo(() => {
    return auditLogs.slice(0, 5);
  }, [auditLogs]);

  const attendanceAlerts = useMemo(() => {
    return employees
      .filter((e) => e.late_arrival_count >= 3)
      .sort((a, b) => b.late_arrival_count - a.late_arrival_count)
      .slice(0, 4);
  }, [employees]);

  const benefitUsageStats = useMemo(() => {
    const usage: Record<string, { name: string; active: number; eligible: number }> = {};
    
    benefits.forEach((benefit) => {
      usage[benefit.id] = { name: benefit.name, active: 0, eligible: 0 };
      employees.forEach((employee) => {
        const eligibility = evaluateBenefitEligibility(employee, benefit);
        if (eligibility.status === "ACTIVE") usage[benefit.id].active++;
        else if (eligibility.status === "ELIGIBLE") usage[benefit.id].eligible++;
      });
    });

    return Object.values(usage)
      .sort((a, b) => b.active - a.active)
      .slice(0, 5);
  }, [employees]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">HR Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage employee benefits, requests, and configurations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{stats.totalEmployees}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eligible Benefits</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{stats.totalEligible}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Gift className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "bg-gradient-to-br",
          stats.pendingRequests > 0 
            ? "from-warning/5 to-warning/10 border-warning/30" 
            : "from-muted/30 to-muted/50"
        )}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{stats.pendingRequests}</p>
              </div>
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                stats.pendingRequests > 0 ? "bg-warning/10" : "bg-muted"
              )}>
                <Clock className={cn("h-6 w-6", stats.pendingRequests > 0 ? "text-warning" : "text-muted-foreground")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Contracts</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{stats.activeContracts}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
                <FileText className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rule Overrides</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{stats.overridesActive}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Shield className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Pending Requests</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-primary"
              onClick={() => onNavigate("requests")}
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <p className="mt-4 font-medium text-foreground">All caught up!</p>
                <p className="text-sm text-muted-foreground">
                  No pending requests to review
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((request) => {
                  const employee = employees.find((e) => e.id === request.employee_id);
                  const benefit = benefits.find((b) => b.id === request.benefit_id);
                  return (
                    <div
                      key={request.id}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent/50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {employee?.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{employee?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {benefit?.name}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="shrink-0 bg-warning/10 text-warning border-warning/30"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-primary"
              onClick={() => onNavigate("audit")}
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      log.action.includes("APPROVED")
                        ? "bg-success/10"
                        : log.action.includes("REJECTED")
                        ? "bg-destructive/10"
                        : "bg-primary/10"
                    )}
                  >
                    {log.action.includes("APPROVED") ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : log.action.includes("REJECTED") ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-1">{log.details}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {log.actor_name} •{" "}
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Benefit Usage Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Benefit Usage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {benefitUsageStats.map((benefit) => {
                const total = employees.length;
                const activePercent = (benefit.active / total) * 100;
                const eligiblePercent = (benefit.eligible / total) * 100;
                return (
                  <div key={benefit.name}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium truncate max-w-[200px]">{benefit.name}</span>
                      <span className="text-muted-foreground shrink-0">
                        {benefit.active} active • {benefit.eligible} eligible
                      </span>
                    </div>
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="bg-success transition-all"
                        style={{ width: `${activePercent}%` }}
                      />
                      <div
                        className="bg-primary/40 transition-all"
                        style={{ width: `${eligiblePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-success" />
                Active
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                Eligible
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Attendance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-success/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  No attendance violations
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendanceAlerts.map((employee) => (
                  <div
                    key={employee.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3",
                      employee.late_arrival_count >= 5
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-warning/30 bg-warning/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {employee.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate max-w-[100px]">
                        {employee.name}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        employee.late_arrival_count >= 5
                          ? "border-destructive/30 text-destructive"
                          : "border-warning/30 text-warning"
                      )}
                    >
                      {employee.late_arrival_count} late
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => onNavigate("employees")}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:shadow-md hover:border-primary/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Employees</p>
            <p className="text-sm text-muted-foreground">Manage eligibility</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate("requests")}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:shadow-md hover:border-primary/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
            <Clock className="h-6 w-6 text-warning" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Review Requests</p>
            <p className="text-sm text-muted-foreground">{stats.pendingRequests} pending</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate("contracts")}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:shadow-md hover:border-primary/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
            <Upload className="h-6 w-6 text-info" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Upload Contract</p>
            <p className="text-sm text-muted-foreground">Add new vendor contract</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate("rules")}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:shadow-md hover:border-primary/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
            <Shield className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Configure Rules</p>
            <p className="text-sm text-muted-foreground">Adjust eligibility</p>
          </div>
        </button>
      </div>
    </div>
  );
}
