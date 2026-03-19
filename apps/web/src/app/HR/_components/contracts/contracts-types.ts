import type { LucideIcon } from "lucide-react";

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
  acceptedCount: number;
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
  label: string;
  value: number;
};

export type UploadContractMutation = {
  uploadContract: BackendContract;
};

export type BenefitContractForContractsQuery = {
  benefitContract: BackendContract | null;
};

export type BenefitContractVersionsQuery = {
  benefitContractVersions: BackendContract[];
};
