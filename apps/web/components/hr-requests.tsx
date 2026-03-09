"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { benefits } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow, format } from "date-fns";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

export function HRRequests() {
  const {
    employees,
    requests,
    updateRequest,
    addAuditLog,
    currentUser,
  } = useAppStore();

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingRequests = useMemo(() => {
    return requests.filter((r) => r.status === "pending");
  }, [requests]);

  const processedRequests = useMemo(() => {
    return requests.filter((r) => r.status !== "pending");
  }, [requests]);

  const selectedRequest = useMemo(() => {
    return requests.find((r) => r.id === selectedRequestId);
  }, [requests, selectedRequestId]);

  const handleApprove = (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    const employee = employees.find((e) => e.id === request.employee_id);
    const benefit = benefits.find((b) => b.id === request.benefit_id);

    updateRequest(requestId, {
      status: "approved",
      reviewed_by: currentUser?.id,
      reviewed_at: new Date(),
    });

    addAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      action: "BENEFIT_APPROVED",
      actor_id: currentUser?.id || "",
      actor_name: currentUser?.name || "",
      target_id: employee?.id || "",
      target_name: employee?.name || "",
      details: `HR approved ${benefit?.name} benefit request`,
      ip_address: "192.168.1.1",
    });
  };

  const handleReject = () => {
    if (!selectedRequestId || !rejectionReason.trim()) return;

    const request = requests.find((r) => r.id === selectedRequestId);
    if (!request) return;

    const employee = employees.find((e) => e.id === request.employee_id);
    const benefit = benefits.find((b) => b.id === request.benefit_id);

    updateRequest(selectedRequestId, {
      status: "rejected",
      reviewed_by: currentUser?.id,
      reviewed_at: new Date(),
      rejection_reason: rejectionReason,
    });

    addAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      action: "BENEFIT_REJECTED",
      actor_id: currentUser?.id || "",
      actor_name: currentUser?.name || "",
      target_id: employee?.id || "",
      target_name: employee?.name || "",
      details: `HR rejected ${benefit?.name} benefit request. Reason: ${rejectionReason}`,
      ip_address: "192.168.1.1",
    });

    setShowRejectModal(false);
    setRejectionReason("");
    setSelectedRequestId(null);
  };

  const RequestCard = ({
    request,
    showActions = true,
  }: {
    request: (typeof requests)[0];
    showActions?: boolean;
  }) => {
    const employee = employees.find((e) => e.id === request.employee_id);
    const benefit = benefits.find((b) => b.id === request.benefit_id);
    const isFinancial = ["down-payment", "okr-bonus"].includes(request.benefit_id);

    return (
      <Card className="transition-colors hover:border-primary/30">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary font-medium">
                {employee?.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{employee?.name}</p>
                {isFinancial && (
                  <Badge
                    variant="outline"
                    className="border-warning/30 bg-warning/10 text-warning"
                  >
                    <DollarSign className="mr-1 h-3 w-3" />
                    Financial
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Requesting: <span className="font-medium">{benefit?.name}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Submitted{" "}
                {formatDistanceToNow(new Date(request.requested_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {request.status === "pending" && showActions && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      setSelectedRequestId(request.id);
                      setShowRejectModal(true);
                    }}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="bg-success text-success-foreground hover:bg-success/90"
                    onClick={() => handleApprove(request.id)}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                </>
              )}
              {request.status === "approved" && (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Approved
                </Badge>
              )}
              {request.status === "rejected" && (
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-3 w-3" />
                  Rejected
                </Badge>
              )}
            </div>
          </div>
          {request.status === "rejected" && request.rejection_reason && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{request.rejection_reason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Benefit Requests
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review and process employee benefit requests
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending
            {pendingRequests.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Processed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-success/50" />
                <p className="mt-4 text-lg font-medium">All caught up!</p>
                <p className="text-sm text-muted-foreground">
                  No pending requests to review
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          {processedRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium">No history yet</p>
                <p className="text-sm text-muted-foreground">
                  Processed requests will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            processedRequests.map((request) => (
              <RequestCard key={request.id} request={request} showActions={false} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request. This will be
              visible to the employee.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!rejectionReason.trim()}
                onClick={handleReject}
              >
                Reject Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
