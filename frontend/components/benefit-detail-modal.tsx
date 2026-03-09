"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { benefits, sampleContracts, Benefit, EmployeeBenefit } from "@/lib/data";
import { evaluateBenefitEligibility } from "@/lib/rule-engine";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  Lock,
  Clock,
  ArrowRight,
  FileText,
  AlertTriangle,
  Dumbbell,
  Shield,
  Heart,
  Laptop,
  PenTool,
  Award,
  Home,
  Target,
  CalendarOff,
  Plane,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  dumbbell: Dumbbell,
  shield: Shield,
  heart: Heart,
  laptop: Laptop,
  "pen-tool": PenTool,
  award: Award,
  home: Home,
  target: Target,
  "calendar-off": CalendarOff,
  plane: Plane,
};

const statusConfig = {
  ACTIVE: {
    label: "Active",
    icon: CheckCircle2,
    className: "bg-success text-success-foreground",
  },
  ELIGIBLE: {
    label: "Eligible",
    icon: ArrowRight,
    className: "bg-primary text-primary-foreground",
  },
  LOCKED: {
    label: "Locked",
    icon: Lock,
    className: "bg-muted text-muted-foreground",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning text-warning-foreground",
  },
};

export function BenefitDetailModal() {
  const {
    currentUser,
    selectedBenefitId,
    setSelectedBenefitId,
    requests,
    addRequest,
    addAuditLog,
  } = useAppStore();

  const [showContract, setShowContract] = useState(false);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const benefit = useMemo(() => {
    return benefits.find((b) => b.id === selectedBenefitId);
  }, [selectedBenefitId]);

  const eligibility = useMemo(() => {
    if (!currentUser || !benefit) return null;
    return evaluateBenefitEligibility(currentUser, benefit);
  }, [currentUser, benefit]);

  const contract = useMemo(() => {
    if (!benefit?.requires_contract) return null;
    return sampleContracts.find((c) => c.benefit_id === benefit.id);
  }, [benefit]);

  const existingRequest = useMemo(() => {
    if (!currentUser || !benefit) return null;
    return requests.find(
      (r) => r.employee_id === currentUser.id && r.benefit_id === benefit.id
    );
  }, [currentUser, benefit, requests]);

  if (!benefit || !eligibility || !currentUser) return null;

  const Icon = iconMap[benefit.icon] || FileText;
  const status = statusConfig[eligibility.status];
  const StatusIcon = status.icon;

  const canRequest = eligibility.status === "ELIGIBLE" && !existingRequest;
  const needsContract = benefit.requires_contract && contract;

  const handleRequestBenefit = async () => {
    if (!canRequest) return;

    if (needsContract && !showContract) {
      setShowContract(true);
      return;
    }

    if (needsContract && !contractAccepted) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newRequest = {
      id: `req-${Date.now()}`,
      employee_id: currentUser.id,
      benefit_id: benefit.id,
      status: "pending" as const,
      requested_at: new Date(),
    };

    addRequest(newRequest);

    // Add audit log
    addAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      action: "BENEFIT_REQUESTED",
      actor_id: currentUser.id,
      actor_name: currentUser.name,
      target_id: benefit.id,
      target_name: benefit.name,
      details: `Employee requested ${benefit.name} benefit`,
      ip_address: "192.168.1.1",
    });

    if (needsContract && contract) {
      addAuditLog({
        id: `log-${Date.now() + 1}`,
        timestamp: new Date(),
        action: "CONTRACT_ACCEPTED",
        actor_id: currentUser.id,
        actor_name: currentUser.name,
        target_id: contract.id,
        target_name: `${benefit.vendor_name} Agreement v${contract.version}`,
        details: `Employee accepted vendor contract for ${benefit.name}`,
        ip_address: "192.168.1.1",
      });
    }

    setIsSubmitting(false);
    setShowContract(false);
    setContractAccepted(false);
    setSelectedBenefitId(null);
  };

  const handleClose = () => {
    setSelectedBenefitId(null);
    setShowContract(false);
    setContractAccepted(false);
  };

  return (
    <Dialog open={!!selectedBenefitId} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{benefit.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {benefit.description}
              </DialogDescription>
            </div>
            <Badge className={cn("shrink-0", status.className)}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-6">
            {/* Benefit Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Subsidy</p>
                <p className="mt-1 text-lg font-semibold">
                  {benefit.subsidy_percentage}%
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="mt-1 text-lg font-semibold">{benefit.category}</p>
              </div>
              {benefit.vendor_name && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="mt-1 text-lg font-semibold">{benefit.vendor_name}</p>
                </div>
              )}
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="mt-1 text-lg font-semibold">
                  {benefit.is_core ? "Core Benefit" : "Optional Benefit"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Rule Evaluation */}
            <div>
              <h3 className="mb-4 font-semibold">Eligibility Rules</h3>
              <div className="space-y-3">
                {eligibility.rule_evaluations.map((rule, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4",
                      rule.passed
                        ? "border-success/30 bg-success/5"
                        : "border-destructive/30 bg-destructive/5"
                    )}
                  >
                    {rule.passed ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium">{rule.rule_name}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {rule.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contract Section */}
            {showContract && contract && (
              <>
                <Separator />
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Vendor Contract</h3>
                    <Badge variant="outline" className="ml-auto">
                      v{contract.version}
                    </Badge>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <ScrollArea className="h-64">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">
                        {contract.content}
                      </pre>
                    </ScrollArea>
                  </div>
                  <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Contract Acceptance Required</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Please read and accept the vendor contract before submitting your request.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Checkbox
                          id="accept-contract"
                          checked={contractAccepted}
                          onCheckedChange={(checked) =>
                            setContractAccepted(checked as boolean)
                          }
                        />
                        <label
                          htmlFor="accept-contract"
                          className="text-sm font-medium cursor-pointer"
                        >
                          I have read and accept the terms and conditions
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="shrink-0 flex items-center justify-end gap-3 border-t border-border pt-4 mt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {eligibility.status === "ACTIVE" && (
            <Button disabled className="bg-success text-success-foreground hover:bg-success/90">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Already Active
            </Button>
          )}
          {eligibility.status === "PENDING" && (
            <Button disabled className="bg-warning text-warning-foreground hover:bg-warning/90">
              <Clock className="mr-2 h-4 w-4" />
              Awaiting Approval
            </Button>
          )}
          {eligibility.status === "LOCKED" && (
            <Button disabled>
              <Lock className="mr-2 h-4 w-4" />
              Locked
            </Button>
          )}
          {canRequest && (
            <Button
              onClick={handleRequestBenefit}
              disabled={isSubmitting || (showContract && !contractAccepted)}
            >
              {isSubmitting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : showContract ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              ) : needsContract ? (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Review Contract
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Request Benefit
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
