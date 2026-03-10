"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { getBenefitStats } from "@/lib/rule-engine";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Briefcase,
  Target,
  Clock,
  Edit2,
  Shield,
  XCircle,
} from "lucide-react";
import { Employee, benefits } from "@/lib/data";
import { evaluateBenefitEligibility } from "@/lib/rule-engine";

export function HREmployees() {
  const { employees, updateEmployee, addAuditLog, currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideBenefitId, setOverrideBenefitId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState("");

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || emp.employment_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  const handleUpdateEmployee = (id: string, field: string, value: unknown) => {
    updateEmployee(id, { [field]: value });
    
    addAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      action: "EMPLOYEE_UPDATED",
      actor_id: currentUser?.id || "",
      actor_name: currentUser?.name || "",
      target_id: id,
      target_name: employees.find((e) => e.id === id)?.name || "",
      details: `Updated ${field} for employee`,
      ip_address: "192.168.1.1",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Employees</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage employee benefit eligibility
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="probation">Probation</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <div className="space-y-3">
        {filteredEmployees.map((employee) => {
          const stats = getBenefitStats(employee);
          const hireDate = new Date(employee.hire_date);
          const tenureMonths = Math.floor(
            (Date.now() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
          );

          return (
            <Card
              key={employee.id}
              className="cursor-pointer transition-colors hover:border-primary/50"
              onClick={() => setSelectedEmployee(employee)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary font-medium">
                      {employee.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">
                        {employee.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          employee.employment_status === "active"
                            ? "border-success/30 bg-success/10 text-success"
                            : employee.employment_status === "probation"
                            ? "border-warning/30 bg-warning/10 text-warning"
                            : "border-destructive/30 bg-destructive/10 text-destructive"
                        )}
                      >
                        {employee.employment_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {employee.email}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {employee.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {tenureMonths} months
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Level {employee.responsibility_level}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-success">
                        {stats.active}
                      </p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">
                        {stats.eligible}
                      </p>
                      <p className="text-xs text-muted-foreground">Eligible</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-muted-foreground">
                        {stats.locked}
                      </p>
                      <p className="text-xs text-muted-foreground">Locked</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Employee Detail Modal */}
      <Dialog
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
                      {selectedEmployee.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>{selectedEmployee.name}</DialogTitle>
                    <DialogDescription>
                      {selectedEmployee.email} • {selectedEmployee.department}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-6 pb-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border border-border bg-card p-3 text-center">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge
                        className={cn(
                          "mt-1",
                          selectedEmployee.employment_status === "active"
                            ? "bg-success text-success-foreground"
                            : selectedEmployee.employment_status === "probation"
                            ? "bg-warning text-warning-foreground"
                            : "bg-destructive text-destructive-foreground"
                        )}
                      >
                        {selectedEmployee.employment_status}
                      </Badge>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3 text-center">
                      <p className="text-sm text-muted-foreground">OKR</p>
                      <Badge
                        className={cn(
                          "mt-1",
                          selectedEmployee.okr_submitted
                            ? "bg-success text-success-foreground"
                            : "bg-destructive text-destructive-foreground"
                        )}
                      >
                        {selectedEmployee.okr_submitted ? "Submitted" : "Missing"}
                      </Badge>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3 text-center">
                      <p className="text-sm text-muted-foreground">Late Arrivals</p>
                      <p className="mt-1 text-lg font-semibold">
                        {selectedEmployee.late_arrival_count}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3 text-center">
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="mt-1 text-lg font-semibold">
                        {selectedEmployee.responsibility_level}
                      </p>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Edit2 className="h-4 w-4" />
                        Quick Edit
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Employment Status</p>
                          <p className="text-sm text-muted-foreground">
                            Change probation/active status
                          </p>
                        </div>
                        <Select
                          value={selectedEmployee.employment_status}
                          onValueChange={(value) =>
                            handleUpdateEmployee(
                              selectedEmployee.id,
                              "employment_status",
                              value
                            )
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="probation">Probation</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">OKR Submitted</p>
                          <p className="text-sm text-muted-foreground">
                            Toggle OKR submission status
                          </p>
                        </div>
                        <Switch
                          checked={selectedEmployee.okr_submitted}
                          onCheckedChange={(checked) =>
                            handleUpdateEmployee(
                              selectedEmployee.id,
                              "okr_submitted",
                              checked
                            )
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Responsibility Level</p>
                          <p className="text-sm text-muted-foreground">
                            Standard / Senior / Lead
                          </p>
                        </div>
                        <Select
                          value={String(selectedEmployee.responsibility_level)}
                          onValueChange={(value) =>
                            handleUpdateEmployee(
                              selectedEmployee.id,
                              "responsibility_level",
                              parseInt(value)
                            )
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Standard</SelectItem>
                            <SelectItem value="2">2 - Senior</SelectItem>
                            <SelectItem value="3">3 - Lead</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Separator />

                  {/* Benefit Eligibility */}
                  <div>
                    <h3 className="mb-4 font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Benefit Eligibility
                    </h3>
                    <div className="space-y-2">
                      {benefits.map((benefit) => {
                        const eligibility = evaluateBenefitEligibility(
                          selectedEmployee,
                          benefit
                        );
                        const failedRules = eligibility.rule_evaluations.filter(
                          (r) => !r.passed
                        );

                        return (
                          <div
                            key={benefit.id}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-3",
                              eligibility.status === "ACTIVE"
                                ? "border-success/30 bg-success/5"
                                : eligibility.status === "ELIGIBLE"
                                ? "border-primary/30 bg-primary/5"
                                : eligibility.status === "PENDING"
                                ? "border-warning/30 bg-warning/5"
                                : "border-border"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {eligibility.status === "ACTIVE" ? (
                                <CheckCircle2 className="h-5 w-5 text-success" />
                              ) : eligibility.status === "ELIGIBLE" ? (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              ) : eligibility.status === "PENDING" ? (
                                <Clock className="h-5 w-5 text-warning" />
                              ) : (
                                <XCircle className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div>
                                <p className="font-medium">{benefit.name}</p>
                                {failedRules.length > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    {failedRules.map((r) => r.rule_name).join(", ")}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  eligibility.status === "ACTIVE"
                                    ? "border-success/30 text-success"
                                    : eligibility.status === "ELIGIBLE"
                                    ? "border-primary/30 text-primary"
                                    : eligibility.status === "PENDING"
                                    ? "border-warning/30 text-warning"
                                    : ""
                                )}
                              >
                                {eligibility.status}
                              </Badge>
                              {eligibility.status === "LOCKED" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOverrideBenefitId(benefit.id);
                                    setShowOverrideModal(true);
                                  }}
                                >
                                  Override
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Override Modal */}
      <Dialog open={showOverrideModal} onOpenChange={setShowOverrideModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Override Eligibility</DialogTitle>
            <DialogDescription>
              Grant a temporary exception for this benefit. A reason is required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Benefit</p>
              <p className="text-muted-foreground">
                {benefits.find((b) => b.id === overrideBenefitId)?.name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Reason for Override</p>
              <Textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Enter justification for this override..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowOverrideModal(false);
                  setOverrideReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!overrideReason.trim()}
                onClick={() => {
                  addAuditLog({
                    id: `log-${Date.now()}`,
                    timestamp: new Date(),
                    action: "ELIGIBILITY_OVERRIDE",
                    actor_id: currentUser?.id || "",
                    actor_name: currentUser?.name || "",
                    target_id: selectedEmployee?.id || "",
                    target_name: selectedEmployee?.name || "",
                    details: `HR granted temporary exception for ${
                      benefits.find((b) => b.id === overrideBenefitId)?.name
                    }. Reason: ${overrideReason}`,
                    ip_address: "192.168.1.1",
                  });
                  setShowOverrideModal(false);
                  setOverrideReason("");
                }}
              >
                Grant Override
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
