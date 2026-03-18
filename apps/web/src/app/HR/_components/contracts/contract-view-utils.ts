import type { ContractStatus } from "./contracts-types";

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

function shiftDate(value: string, years: number) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  parsed.setFullYear(parsed.getFullYear() + years);
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
}

function derivePreviousVersion(version: string) {
  const match = version.match(/^v(\d+)(?:\.(\d+))?$/i);
  if (!match) return null;
  const major = Number.parseInt(match[1] ?? "0", 10);
  const minor = Number.parseInt(match[2] ?? "0", 10);
  if (major <= 0 && minor <= 0) return null;
  if (minor > 0) return `v${major}.${minor - 1}`;
  if (major > 1) return `v${major - 1}.0`;
  return null;
}

export function deriveNextVersion(version: string) {
  const match = version.match(/^v(\d+)(?:\.(\d+))?$/i);
  if (!match) return version;
  const major = Number.parseInt(match[1] ?? "1", 10);
  const minor = Number.parseInt(match[2] ?? "0", 10);
  return `v${major}.${minor + 1}`;
}

export function buildHistoryRows(contract: ContractViewContract): HistoryRow[] {
  const rows: HistoryRow[] = [{
    actionLabel: contract.status === "active" ? "Current" : "Expired",
    actionTone: contract.status === "active" ? "text-[#00A63E]" : "text-[#E7000B]",
    effectiveDate: contract.effectiveDate,
    expiryDate: contract.expiryDate,
    status: contract.status,
    version: contract.version,
  }];
  const previousVersion = derivePreviousVersion(contract.version);
  if (previousVersion) {
    rows.push({
      actionLabel: "Expired",
      actionTone: "text-[#E7000B]",
      effectiveDate: shiftDate(contract.effectiveDate, -1),
      expiryDate: shiftDate(contract.expiryDate, -1),
      status: "archived",
      version: previousVersion,
    });
  }
  return rows;
}

export function toEditableDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}
