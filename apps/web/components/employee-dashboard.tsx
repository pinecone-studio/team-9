"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { getBenefitsByCategory, getBenefitStats } from "@/lib/rule-engine";
import { StatsCards } from "./stats-cards";
import { BenefitCard } from "./benefit-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Briefcase, 
  Target, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Mail,
  Building2,
  User,
} from "lucide-react";

const categoryOrder = ["Wellness", "Equipment", "Financial", "Career Development", "Flexibility"];

export function EmployeeDashboard() {
  const { currentUser, setSelectedBenefitId } = useAppStore();
  const [renderedAt] = useState(() => Date.now());

  const benefitsByCategory = useMemo(() => {
    if (!currentUser) return {};
    return getBenefitsByCategory(currentUser);
  }, [currentUser]);

  const stats = useMemo(() => {
    if (!currentUser) return { total: 0, active: 0, eligible: 0, locked: 0, pending: 0 };
    return getBenefitStats(currentUser);
  }, [currentUser]);

  if (!currentUser) return null;

  const hireDate = new Date(currentUser.hire_date);
  const tenureMonths = Math.floor(
    (renderedAt - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  const tenureYears = Math.floor(tenureMonths / 12);
  const remainingMonths = tenureMonths % 12;
  const tenureDisplay = tenureYears > 0 
    ? `${tenureYears}y ${remainingMonths}m` 
    : `${tenureMonths} months`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your employee benefits and view eligibility status
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Profile Summary & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Summary */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border">
            <CardTitle className="text-lg">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <Avatar className="h-20 w-20 shrink-0 ring-4 ring-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                  {currentUser.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-5">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{currentUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{currentUser.email}</span>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{currentUser.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-medium capitalize">{currentUser.role.replace("_", " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tenure</p>
                      <p className="text-sm font-medium">{tenureDisplay}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Level</p>
                      <p className="text-sm font-medium">Level {currentUser.responsibility_level}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Status */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Eligibility Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Employment Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2.5">
                {currentUser.employment_status === "active" ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning" />
                )}
                <span className="text-sm font-medium">Employment</span>
              </div>
              <Badge
                variant={currentUser.employment_status === "active" ? "default" : "secondary"}
                className={
                  currentUser.employment_status === "active"
                    ? "bg-success text-success-foreground"
                    : "bg-warning text-warning-foreground"
                }
              >
                {currentUser.employment_status}
              </Badge>
            </div>

            {/* OKR Submitted */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2.5">
                {currentUser.okr_submitted ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="text-sm font-medium">OKR Status</span>
              </div>
              <Badge
                variant={currentUser.okr_submitted ? "default" : "destructive"}
                className={
                  currentUser.okr_submitted
                    ? "bg-success text-success-foreground"
                    : ""
                }
              >
                {currentUser.okr_submitted ? "Submitted" : "Missing"}
              </Badge>
            </div>

            {/* Late Arrivals */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2.5">
                {currentUser.late_arrival_count < 3 ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : currentUser.late_arrival_count < 5 ? (
                  <AlertCircle className="h-5 w-5 text-warning" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="text-sm font-medium">Attendance</span>
              </div>
              <Badge
                variant={currentUser.late_arrival_count < 3 ? "default" : currentUser.late_arrival_count < 5 ? "secondary" : "destructive"}
                className={
                  currentUser.late_arrival_count < 3
                    ? "bg-success text-success-foreground"
                    : currentUser.late_arrival_count < 5
                    ? "bg-warning text-warning-foreground"
                    : ""
                }
              >
                {currentUser.late_arrival_count}/5 late
              </Badge>
            </div>

            {/* Benefit Progress */}
            <Separator />
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">Benefits Activated</span>
                <span className="font-semibold text-foreground">
                  {stats.active} / {stats.total}
                </span>
              </div>
              <Progress
                value={(stats.active / stats.total) * 100}
                className="h-2.5"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.eligible} more benefits available to claim
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits by Category */}
      {categoryOrder.map((category) => {
        const benefits = benefitsByCategory[category];
        if (!benefits || benefits.length === 0) return null;

        return (
          <div key={category}>
            <h2 className="mb-4 text-lg font-semibold text-foreground">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <BenefitCard
                  key={benefit.id}
                  benefit={benefit}
                  eligibility={benefit.eligibility}
                  onClick={() => setSelectedBenefitId(benefit.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
