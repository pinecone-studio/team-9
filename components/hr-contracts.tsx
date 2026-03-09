"use client";

import { useState, useMemo } from "react";
import { sampleContracts, benefits } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, differenceInDays } from "date-fns";
import {
  FileText,
  Search,
  Upload,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Clock,
  Package,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export function HRContracts() {
  const { addAuditLog, currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const contracts = useMemo(() => {
    return sampleContracts.filter((contract) => {
      const benefit = benefits.find((b) => b.id === contract.benefit_id);
      return (
        benefit?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        benefit?.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.version.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const selectedContract = useMemo(() => {
    return sampleContracts.find((c) => c.id === selectedContractId);
  }, [selectedContractId]);

  const activeContracts = contracts.filter(
    (c) => new Date(c.expiry_date) > new Date()
  );
  const expiringContracts = contracts.filter((c) => {
    const daysUntilExpiry = differenceInDays(new Date(c.expiry_date), new Date());
    return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
  });

  const getContractStatus = (expiryDate: Date) => {
    const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date());
    if (daysUntilExpiry < 0) return { label: "Expired", color: "destructive" };
    if (daysUntilExpiry <= 30) return { label: "Expiring Soon", color: "warning" };
    if (daysUntilExpiry <= 90) return { label: "Expiring", color: "warning" };
    return { label: "Active", color: "success" };
  };

  const handleUpload = () => {
    addAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      action: "CONTRACT_UPLOADED",
      actor_id: currentUser?.id || "",
      actor_name: currentUser?.name || "",
      target_id: "new-contract",
      target_name: "New Vendor Contract",
      details: "New vendor contract uploaded",
      ip_address: "192.168.1.1",
    });
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Vendor Contracts
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage vendor contracts and agreements
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{activeContracts.length}</p>
                <p className="text-xs text-muted-foreground">Active Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{expiringContracts.length}</p>
                <p className="text-xs text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{contracts.length}</p>
                <p className="text-xs text-muted-foreground">Total Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contract List */}
      <div className="space-y-3">
        {contracts.map((contract) => {
          const benefit = benefits.find((b) => b.id === contract.benefit_id);
          const status = getContractStatus(contract.expiry_date);
          const daysUntilExpiry = differenceInDays(
            new Date(contract.expiry_date),
            new Date()
          );

          return (
            <Card
              key={contract.id}
              className="cursor-pointer transition-colors hover:border-primary/50"
              onClick={() => setSelectedContractId(contract.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{benefit?.name}</p>
                      <Badge variant="outline">v{contract.version}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {benefit?.vendor_name}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires: {format(new Date(contract.expiry_date), "MMM dd, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Uploaded: {format(new Date(contract.uploaded_at), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        status.color === "success" &&
                          "border-success/30 bg-success/10 text-success",
                        status.color === "warning" &&
                          "border-warning/30 bg-warning/10 text-warning",
                        status.color === "destructive" &&
                          "border-destructive/30 bg-destructive/10 text-destructive"
                      )}
                    >
                      {status.label}
                      {daysUntilExpiry > 0 && daysUntilExpiry <= 90 && (
                        <span className="ml-1">({daysUntilExpiry}d)</span>
                      )}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contract Detail Modal */}
      <Dialog
        open={!!selectedContractId}
        onOpenChange={() => setSelectedContractId(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedContract && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle>
                      {benefits.find((b) => b.id === selectedContract.benefit_id)?.name}{" "}
                      Contract
                    </DialogTitle>
                    <DialogDescription>
                      Version {selectedContract.version} •{" "}
                      {benefits.find((b) => b.id === selectedContract.benefit_id)?.vendor_name}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-3 py-4">
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Version</p>
                  <p className="font-semibold">{selectedContract.version}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Expiry Date</p>
                  <p className="font-semibold">
                    {format(new Date(selectedContract.expiry_date), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Uploaded By</p>
                  <p className="font-semibold">{selectedContract.uploaded_by}</p>
                </div>
              </div>

              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">
                    {selectedContract.content}
                  </pre>
                </div>
              </ScrollArea>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedContractId(null)}>
                  Close
                </Button>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Version
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Contract</DialogTitle>
            <DialogDescription>
              Upload a new vendor contract or update an existing one.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8">
              <div className="text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">
                  Drag and drop your PDF here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse files
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Browse Files
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>Upload Contract</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
