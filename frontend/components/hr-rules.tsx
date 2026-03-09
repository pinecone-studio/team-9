"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Clock,
  Calendar,
  Target,
  Users,
  Shield,
  AlertCircle,
  CheckCircle2,
  Settings,
  Save,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { benefits } from "@/lib/data";

interface RuleConfig {
  id: string;
  name: string;
  description: string;
  type: "threshold" | "boolean" | "tenure" | "level";
  currentValue: number | boolean;
  unit?: string;
  affectedBenefits: string[];
}

const defaultRules: RuleConfig[] = [
  {
    id: "probation-gate",
    name: "Probation Gate",
    description: "Block benefits during probation period",
    type: "boolean",
    currentValue: true,
    affectedBenefits: ["gym", "insurance", "down-payment", "extra-responsibility", "macbook", "remote-work", "travel"],
  },
  {
    id: "okr-gate",
    name: "OKR Submission Gate",
    description: "Require OKR submission for non-core benefits",
    type: "boolean",
    currentValue: true,
    affectedBenefits: ["gym", "insurance", "macbook", "extra-responsibility", "down-payment", "okr-bonus", "remote-work", "travel"],
  },
  {
    id: "late-arrival-threshold",
    name: "Late Arrival Threshold",
    description: "Maximum late arrivals within 30 days",
    type: "threshold",
    currentValue: 3,
    unit: "arrivals",
    affectedBenefits: ["gym", "insurance", "remote-work", "okr-bonus"],
  },
  {
    id: "teacher-late-time",
    name: "Teacher Late Arrival Time",
    description: "Check-in time after which teacher is considered late",
    type: "threshold",
    currentValue: 9,
    unit: "AM",
    affectedBenefits: [],
  },
  {
    id: "general-late-time",
    name: "General Late Arrival Time",
    description: "Check-in time after which non-teacher is considered late",
    type: "threshold",
    currentValue: 10,
    unit: "AM",
    affectedBenefits: [],
  },
  {
    id: "macbook-tenure",
    name: "MacBook Tenure Requirement",
    description: "Minimum months of employment for MacBook subsidy",
    type: "tenure",
    currentValue: 6,
    unit: "months",
    affectedBenefits: ["macbook"],
  },
  {
    id: "travel-tenure",
    name: "Travel Tenure Requirement",
    description: "Minimum months of employment for travel subsidy",
    type: "tenure",
    currentValue: 12,
    unit: "months",
    affectedBenefits: ["travel"],
  },
  {
    id: "down-payment-tenure",
    name: "Down Payment Tenure Requirement",
    description: "Minimum months for down payment assistance",
    type: "tenure",
    currentValue: 24,
    unit: "months",
    affectedBenefits: ["down-payment"],
  },
  {
    id: "extra-responsibility-level",
    name: "Extra Responsibility Level",
    description: "Minimum responsibility level required",
    type: "level",
    currentValue: 2,
    affectedBenefits: ["extra-responsibility"],
  },
  {
    id: "down-payment-level",
    name: "Down Payment Level",
    description: "Minimum responsibility level for down payment",
    type: "level",
    currentValue: 2,
    affectedBenefits: ["down-payment"],
  },
];

export function HRRules() {
  const { addAuditLog, currentUser } = useAppStore();
  const [rules, setRules] = useState<RuleConfig[]>(defaultRules);
  const [hasChanges, setHasChanges] = useState(false);

  const handleRuleChange = (ruleId: string, newValue: number | boolean) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, currentValue: newValue } : rule
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    addAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      action: "RULE_UPDATED",
      actor_id: currentUser?.id || "",
      actor_name: currentUser?.name || "",
      target_id: "rules",
      target_name: "Benefit Rules",
      details: "Updated benefit eligibility rules configuration",
      ip_address: "192.168.1.1",
    });
    setHasChanges(false);
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case "threshold":
        return AlertCircle;
      case "boolean":
        return Shield;
      case "tenure":
        return Calendar;
      case "level":
        return Target;
      default:
        return Settings;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Rule Configuration
          </h1>
          <p className="mt-1 text-muted-foreground">
            Configure benefit eligibility rules without coding
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>

      {/* Quick Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{rules.filter(r => r.type === "boolean").length}</p>
                <p className="text-xs text-muted-foreground">Gate Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{rules.filter(r => r.type === "threshold").length}</p>
                <p className="text-xs text-muted-foreground">Threshold Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Calendar className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{rules.filter(r => r.type === "tenure").length}</p>
                <p className="text-xs text-muted-foreground">Tenure Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{rules.filter(r => r.type === "level").length}</p>
                <p className="text-xs text-muted-foreground">Level Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Configuration */}
      <Accordion type="multiple" defaultValue={["gates", "thresholds", "tenure", "levels"]} className="space-y-4">
        {/* Gate Rules */}
        <AccordionItem value="gates" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Gate Rules</span>
              <Badge variant="secondary" className="ml-2">
                {rules.filter(r => r.type === "boolean").length} rules
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {rules.filter(r => r.type === "boolean").map((rule) => (
                <div key={rule.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div className="flex-1">
                    <p className="font-medium">{rule.name}</p>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                    {rule.affectedBenefits.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rule.affectedBenefits.slice(0, 4).map((benefitId) => {
                          const benefit = benefits.find(b => b.id === benefitId);
                          return (
                            <Badge key={benefitId} variant="outline" className="text-xs">
                              {benefit?.name}
                            </Badge>
                          );
                        })}
                        {rule.affectedBenefits.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{rule.affectedBenefits.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Switch
                    checked={rule.currentValue as boolean}
                    onCheckedChange={(checked) => handleRuleChange(rule.id, checked)}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Threshold Rules */}
        <AccordionItem value="thresholds" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning" />
              <span className="font-semibold">Threshold Rules</span>
              <Badge variant="secondary" className="ml-2">
                {rules.filter(r => r.type === "threshold").length} rules
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {rules.filter(r => r.type === "threshold").map((rule) => (
                <div key={rule.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div className="flex-1">
                    <p className="font-medium">{rule.name}</p>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={rule.currentValue as number}
                      onChange={(e) => handleRuleChange(rule.id, parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                    {rule.unit && (
                      <span className="text-sm text-muted-foreground">{rule.unit}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tenure Rules */}
        <AccordionItem value="tenure" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-info" />
              <span className="font-semibold">Tenure Rules</span>
              <Badge variant="secondary" className="ml-2">
                {rules.filter(r => r.type === "tenure").length} rules
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {rules.filter(r => r.type === "tenure").map((rule) => {
                const benefit = benefits.find(b => rule.affectedBenefits.includes(b.id));
                return (
                  <div key={rule.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                    <div className="flex-1">
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      {benefit && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {benefit.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={rule.currentValue as number}
                        onChange={(e) => handleRuleChange(rule.id, parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">{rule.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Level Rules */}
        <AccordionItem value="levels" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-success" />
              <span className="font-semibold">Level Rules</span>
              <Badge variant="secondary" className="ml-2">
                {rules.filter(r => r.type === "level").length} rules
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {rules.filter(r => r.type === "level").map((rule) => {
                const benefit = benefits.find(b => rule.affectedBenefits.includes(b.id));
                return (
                  <div key={rule.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                    <div className="flex-1">
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      {benefit && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {benefit.name}
                        </Badge>
                      )}
                    </div>
                    <Select
                      value={String(rule.currentValue)}
                      onValueChange={(value) => handleRuleChange(rule.id, parseInt(value))}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Level 1 - Standard</SelectItem>
                        <SelectItem value="2">Level 2 - Senior</SelectItem>
                        <SelectItem value="3">Level 3 - Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
