"use client";

import { useState, useMemo } from "react";
import { benefits, Benefit } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Laptop,
  DollarSign,
  GraduationCap,
  Clock,
  Users,
  FileText,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { evaluateBenefitEligibility } from "@/lib/rule-engine";

const categoryIcons: Record<string, React.ReactNode> = {
  Wellness: <Heart className="h-5 w-5" />,
  Equipment: <Laptop className="h-5 w-5" />,
  Financial: <DollarSign className="h-5 w-5" />,
  "Career Development": <GraduationCap className="h-5 w-5" />,
  Flexibility: <Clock className="h-5 w-5" />,
};

const categoryColors: Record<string, string> = {
  Wellness: "bg-pink-100 text-pink-700",
  Equipment: "bg-blue-100 text-blue-700",
  Financial: "bg-emerald-100 text-emerald-700",
  "Career Development": "bg-amber-100 text-amber-700",
  Flexibility: "bg-violet-100 text-violet-700",
};

const getLinkedRuleLabels = (benefitId: string): string[] => {
  const labels = ["Probation status", "OKR submission", "Role requirement"];

  if (["gym", "insurance", "remote-work", "okr-bonus"].includes(benefitId)) {
    labels.push("Attendance threshold");
  }
  if (["extra-responsibility", "down-payment"].includes(benefitId)) {
    labels.push("Responsibility level");
  }
  if (benefitId === "ux-tools") {
    labels.push("UX Engineer role only");
  }
  if (["macbook", "travel", "down-payment"].includes(benefitId)) {
    labels.push("Minimum tenure");
  }

  return labels;
};

export function HRCatalog() {
  const { employees } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const categories = useMemo(() => {
    const grouped: Record<string, Benefit[]> = {};
    benefits.forEach((benefit) => {
      if (!grouped[benefit.category]) {
        grouped[benefit.category] = [];
      }
      grouped[benefit.category].push(benefit);
    });
    return grouped;
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const filtered: Record<string, Benefit[]> = {};
    Object.entries(categories).forEach(([category, benefitList]) => {
      const matching = benefitList.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matching.length > 0) {
        filtered[category] = matching;
      }
    });
    return filtered;
  }, [categories, searchQuery]);

  const getBenefitStats = (benefit: Benefit) => {
    let activeCount = 0;
    let eligibleCount = 0;

    employees.forEach((employee) => {
      const eligibility = evaluateBenefitEligibility(employee, benefit);
      if (eligibility.status === "ACTIVE") activeCount++;
      else if (eligibility.status === "ELIGIBLE") eligibleCount++;
    });

    return { activeCount, eligibleCount };
  };

  const categoryOrder = ["Wellness", "Equipment", "Financial", "Career Development", "Flexibility"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Benefits Catalog</h1>
          <p className="mt-1 text-muted-foreground">
            Manage company benefits and their configurations
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search benefits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Benefits by Category */}
      <div className="space-y-8">
        {categoryOrder.map((category) => {
          const benefitList = filteredCategories[category];
          if (!benefitList || benefitList.length === 0) return null;

          return (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", categoryColors[category])}>
                  {categoryIcons[category]}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{category}</h2>
                  <p className="text-sm text-muted-foreground">{benefitList.length} benefits</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {benefitList.map((benefit) => {
                  const stats = getBenefitStats(benefit);
                  return (
                    <Card
                      key={benefit.id}
                      className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                      onClick={() => {
                        setSelectedBenefit(benefit);
                        setEditModalOpen(true);
                      }}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{benefit.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {benefit.description}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="shrink-0 ml-2 bg-primary/10 text-primary"
                          >
                            {benefit.subsidy_percentage}%
                          </Badge>
                        </div>

                        <Separator className="my-3" />

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              <span className="text-muted-foreground">{stats.activeCount} active</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">{stats.eligibleCount} eligible</span>
                            </div>
                          </div>
                          {benefit.requires_contract && (
                            <Badge variant="outline" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              Contract
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Benefit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          {selectedBenefit && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", categoryColors[selectedBenefit.category])}>
                    {categoryIcons[selectedBenefit.category]}
                  </div>
                  <div>
                    <DialogTitle>{selectedBenefit.name}</DialogTitle>
                    <DialogDescription>{selectedBenefit.category}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Benefit Name</Label>
                  <Input id="name" defaultValue={selectedBenefit.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue={selectedBenefit.description} rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue={selectedBenefit.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOrder.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subsidy">Subsidy Percent</Label>
                    <div className="relative">
                      <Input
                        id="subsidy"
                        type="number"
                        defaultValue={selectedBenefit.subsidy_percentage}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Requires Contract</p>
                    <p className="text-sm text-muted-foreground">
                      Employees must accept a contract to use this benefit
                    </p>
                  </div>
                  <Switch defaultChecked={selectedBenefit.requires_contract} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Active</p>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable this benefit
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <Separator />

                <div>
                  <Label className="mb-2 block">Linked Eligibility Rules</Label>
                  <div className="space-y-2">
                    {getLinkedRuleLabels(selectedBenefit.id).map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm"
                      >
                        <span className="font-medium">{rule}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 gap-2">
                    <Settings className="h-4 w-4" />
                    Edit Rules
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setEditModalOpen(false)}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
