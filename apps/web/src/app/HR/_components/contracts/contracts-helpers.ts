import { gql } from "@apollo/client";
import type {
  BackendContract,
  BenefitContractVersionsQuery,
  ContractRow,
  ContractStatus,
} from "./contracts-types";

export const BenefitContractForContractsDocument = gql`
  query BenefitContractForContracts($benefitId: ID!) {
    benefitContract(benefitId: $benefitId) {
      id
      benefitId
      vendorName
      version
      effectiveDate
      expiryDate
      isActive
    }
  }
`;

export const BenefitAcceptedEmployeesDocument = gql`
  query BenefitAcceptedEmployees($benefitId: ID!) {
    benefitAcceptedEmployees(benefitId: $benefitId) {
      id
      name
      email
      position
      department
      employmentStatus
      hireDate
      responsibilityLevel
      okrSubmitted
      lateArrivalCount
    }
  }
`;

export const BenefitContractVersionsDocument = gql`
  query BenefitContractVersions($benefitId: ID!) {
    benefitContractVersions(benefitId: $benefitId) {
      id
      benefitId
      vendorName
      version
      effectiveDate
      expiryDate
      isActive
    }
  }
`;

export const UploadContractDocument = gql`
  mutation UploadContract($input: ContractInput!) {
    uploadContract(input: $input) {
      id
      benefitId
      vendorName
      version
      effectiveDate
      expiryDate
      isActive
    }
  }
`;

export type { BenefitContractVersionsQuery };

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

export function normalizeEditableDate(value: string) {
  return value.replace(/\./g, "-");
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read contract file."));
    };
    reader.onerror = () => reject(new Error("Failed to read contract file."));
    reader.readAsDataURL(file);
  });
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

export function buildContractRow(input: {
  acceptedCount: number;
  benefit: string;
  benefitId: string;
  contract: BackendContract;
}): ContractRow {
  return {
    acceptedCount: input.acceptedCount,
    benefit: input.benefit,
    benefitId: input.benefitId,
    effectiveDate: formatDate(input.contract.effectiveDate),
    expiryDate: formatDate(input.contract.expiryDate),
    status: deriveStatus(input.contract),
    vendor: input.contract.vendorName?.trim() || "-",
    version: input.contract.version?.trim() || "v1.0",
  };
}
