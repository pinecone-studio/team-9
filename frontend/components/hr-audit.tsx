"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  FileText,
  Shield,
  Upload,
  Edit,
  Clock,
} from "lucide-react";

const actionConfig: Record<
  string,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  BENEFIT_REQUESTED: {
    icon: Clock,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  BENEFIT_APPROVED: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  BENEFIT_REJECTED: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  CONTRACT_ACCEPTED: {
    icon: FileText,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  CONTRACT_UPLOADED: {
    icon: Upload,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  ELIGIBILITY_OVERRIDE: {
    icon: Shield,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  EMPLOYEE_UPDATED: {
    icon: Edit,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  RULE_UPDATED: {
    icon: Edit,
    color: "text-info",
    bgColor: "bg-info/10",
  },
};

export function HRAudit() {
  const { auditLogs } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.actor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.target_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesAction =
        actionFilter === "all" || log.action === actionFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const logDate = new Date(log.timestamp);
        const now = new Date();
        switch (dateFilter) {
          case "today":
            matchesDate = logDate.toDateString() === now.toDateString();
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesAction && matchesDate;
    });
  }, [auditLogs, searchQuery, actionFilter, dateFilter]);

  const handleExport = () => {
    const csvContent = [
      ["Timestamp", "Action", "Actor", "Target", "Details", "IP Address"],
      ...filteredLogs.map((log) => [
        format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
        log.action,
        log.actor_name,
        log.target_name || "",
        log.details,
        log.ip_address,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueActions = useMemo(() => {
    return [...new Set(auditLogs.map((log) => log.action))];
  }, [auditLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Audit Log</h1>
          <p className="mt-1 text-muted-foreground">
            Track all system actions and changes
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Log Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[120px]">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        No audit logs found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const config = actionConfig[log.action] || {
                    icon: FileText,
                    color: "text-muted-foreground",
                    bgColor: "bg-muted",
                  };
                  const Icon = config.icon;

                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(log.timestamp), "MMM dd, yyyy")}
                        <br />
                        <span className="text-muted-foreground">
                          {format(new Date(log.timestamp), "HH:mm:ss")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full",
                              config.bgColor
                            )}
                          >
                            <Icon className={cn("h-3.5 w-3.5", config.color)} />
                          </div>
                          <span className="text-xs font-medium">
                            {log.action.replace(/_/g, " ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.actor_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.target_name || "-"}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate text-sm">
                        {log.details}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log.ip_address}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredLogs.length} of {auditLogs.length} log entries
        </p>
      </div>
    </div>
  );
}
