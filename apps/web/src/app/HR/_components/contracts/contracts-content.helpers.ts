import type { BenefitCatalogPageQuery } from "@/shared/apollo/generated";
import {
  CheckCircle2,
  FileClock,
  FileText,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ContractStatus = "active" | "expiring" | "expired" | "archived";

export type BackendContract = {
  benefitId: string;
  effectiveDate: string;
  expiryDate: string;
  id: string;
  isActive: boolean;
  vendorName: string;
  version: string;
};

export type ContractRow = {
  accepted: string;
  benefit: string;
  benefitId: string;
  effectiveDate: string;
  expiryDate: string;
  status: ContractStatus;
  vendor: string;
  version: string;
};

export type ContractKpiCard = {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: number;
};

export type CatalogBenefit = NonNullable<
  NonNullable<BenefitCatalogPageQuery["allBenefits"]>[number]
>;

export type BenefitEligibilitySummaryRecord =
  BenefitCatalogPageQuery["listBenefitEligibilitySummary"][number];

export function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function deriveStatus(contract: BackendContract): ContractStatus {
  if (!contract.isActive) {
    return "archived";
  }

  const now = new Date();
  const expiry = new Date(contract.expiryDate);
  if (!Number.isNaN(expiry.getTime())) {
    if (expiry < now) {
      return "expired";
    }

    const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysUntilExpiry <= 45) {
      return "expiring";
    }
  }

  return "active";
}

export function buildContractRows({
  allBenefits,
  contractBenefitIds,
  contractsByBenefitId,
  summaries,
}: {
  allBenefits: CatalogBenefit[];
  contractBenefitIds: string[];
  contractsByBenefitId: Record<string, BackendContract | null>;
  summaries: BenefitEligibilitySummaryRecord[];
}) {
  const summaryByBenefitId = new Map(
    summaries.map((summary) => [summary.benefitId, summary]),
  );
  const benefitsById = new Map(allBenefits.map((benefit) => [benefit.id, benefit]));

  return contractBenefitIds.flatMap((benefitId) => {
    const contract = contractsByBenefitId[benefitId];
    const benefit = benefitsById.get(benefitId);

    if (!contract || !benefit) {
      return [];
    }

    const summary = summaryByBenefitId.get(benefit.id);

    return [
      {
        accepted: `${summary?.eligibleEmployees ?? 0} accepted`,
        benefit: benefit.title,
        benefitId: benefit.id,
        effectiveDate: formatDate(contract.effectiveDate),
        expiryDate: formatDate(contract.expiryDate),
        status: deriveStatus(contract),
        vendor: contract.vendorName?.trim() || benefit.vendorName?.trim() || "-",
        version: contract.version?.trim() || "v1.0",
      } satisfies ContractRow,
    ];
  });
}

export function filterContractRows(rows: ContractRow[], searchText: string) {
  const term = searchText.trim().toLowerCase();

  if (!term) {
    return rows;
  }

  return rows.filter((row) =>
    [
      row.benefit,
      row.vendor,
      row.version,
      row.status,
      row.accepted,
      row.effectiveDate,
      row.expiryDate,
    ]
      .join(" ")
      .toLowerCase()
      .includes(term),
  );
}

export function buildContractKpiCards(contractRows: ContractRow[]): ContractKpiCard[] {
  return [
    {
      icon: CheckCircle2,
      iconClassName: "text-[#00C950]",
      label: "Active Contracts",
      value: contractRows.filter((row) => row.status === "active").length,
    },
    {
      icon: FileClock,
      iconClassName: "text-[#FD9A00]",
      label: "Expiring Soon",
      value: contractRows.filter((row) => row.status === "expiring").length,
    },
    {
      icon: FileText,
      iconClassName: "text-[#737373]",
      label: "Archived Versions",
      value: contractRows.filter((row) => row.status === "archived").length,
    },
    {
      icon: Users,
      iconClassName: "text-[#737373]",
      label: "Acceptances This Month",
      value: 0,
    },
  ];
}
