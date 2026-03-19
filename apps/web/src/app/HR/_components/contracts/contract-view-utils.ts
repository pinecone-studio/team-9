import { deriveStatus, formatDate } from "./contracts-helpers";
import type { BackendContract, ContractStatus } from "./contracts-types";

export type ContractViewContract = {
  acceptedCount: number;
  benefit: string;
  benefitId: string;
  effectiveDate: string;
  expiryDate: string;
  status: ContractStatus;
  vendor: string;
  version: string;
};

export type HistoryRow = {
  id: string;
  actionLabel: string;
  actionTone: string;
  effectiveDate: string;
  expiryDate: string;
  status: ContractStatus;
  version: string;
};

export function resolveSignedContractUrl(signedUrl: string) {
  if (/^https?:\/\//i.test(signedUrl)) {
    return signedUrl;
  }
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  if (endpoint) {
    return new URL(signedUrl, new URL(endpoint).origin).toString();
  }
  return new URL(signedUrl, window.location.origin).toString();
}

function slugifyFilePart(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export function buildContractFileName(vendor: string, version: string) {
  const vendorPart = slugifyFilePart(vendor || "contract");
  const versionPart = slugifyFilePart(version || "v1");
  return `${vendorPart || "contract"}_contract_${versionPart || "v1"}.pdf`;
}

export function getStatusBadge(status: ContractStatus) {
  if (status === "active") return "bg-[#DCFCE7] text-[#016630]";
  if (status === "expiring") return "bg-[#FEF3C6] text-[#973C00]";
  if (status === "expired") return "bg-[#FEF2F2] text-[#E7000B]";
  return "bg-[#F5F5F5] text-[#171717]";
}

export function getStatusLabel(status: ContractStatus) {
  if (status === "expiring") return "Expiring Soon";
  if (status === "expired") return "Expired";
  if (status === "archived") return "Archived";
  return "Active";
}

export function deriveNextVersion(version: string) {
  const match = version.match(/^v(\d+)(?:\.(\d+))?$/i);
  if (!match) return version;
  const major = Number.parseInt(match[1] ?? "1", 10);
  const minor = Number.parseInt(match[2] ?? "0", 10);
  return `v${major}.${minor + 1}`;
}

function buildHistoryAction(status: ContractStatus, isActive: boolean) {
  if (isActive) {
    return {
      actionLabel: "Current",
      actionTone: "text-[#00A63E]",
    };
  }

  if (status === "expired") {
    return {
      actionLabel: "Expired",
      actionTone: "text-[#E7000B]",
    };
  }

  return {
    actionLabel: "Archived",
    actionTone: "text-[#525252]",
  };
}

function deriveHistoryStatus(contract: BackendContract): ContractStatus {
  if (contract.isActive) {
    return deriveStatus(contract);
  }

  const expiry = new Date(contract.expiryDate);
  if (!Number.isNaN(expiry.getTime()) && expiry < new Date()) {
    return "expired";
  }

  return "archived";
}

export function buildHistoryRows(contract: ContractViewContract): HistoryRow[] {
  const action = buildHistoryAction(contract.status, true);
  return [{
    id: `${contract.benefitId}-${contract.version}`,
    actionLabel: action.actionLabel,
    actionTone: action.actionTone,
    effectiveDate: contract.effectiveDate,
    expiryDate: contract.expiryDate,
    status: contract.status,
    version: contract.version,
  }];
}

export function buildHistoryRowsFromContracts(contracts: BackendContract[]): HistoryRow[] {
  return contracts.map((contract) => {
    const status = deriveHistoryStatus(contract);
    const action = buildHistoryAction(status, contract.isActive);

    return {
      id: contract.id,
      actionLabel: action.actionLabel,
      actionTone: action.actionTone,
      effectiveDate: formatDate(contract.effectiveDate),
      expiryDate: formatDate(contract.expiryDate),
      status,
      version: contract.version,
    };
  });
}

export function toEditableDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}
