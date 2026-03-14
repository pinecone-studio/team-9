import type { BenefitRequestRow, RequestStatus } from "./requests-data";

type ContractInfo = {
  acceptedAt: string;
  status: string;
  version: string;
};

type SnapshotItem = {
  label: string;
  value: string;
};

export type AuditLogItem = {
  detail: string;
  event: string;
};

export type BenefitReviewDetail = {
  approvalRoute: string;
  auditLog: AuditLogItem[];
  category: string;
  contract: ContractInfo;
  eligibilityChecks: string[];
  employee: string;
  position: string;
  progress: string;
  snapshot: SnapshotItem[];
  status: RequestStatus;
  submittedAt: string;
  subtitle: string;
  title: string;
};

const submittedAtMap: Record<string, string> = {
  "Mar 10": "Mar 10, 2025, 09:45 PM",
  "Mar 11": "Mar 11, 2025, 10:15 PM",
  "Mar 12": "Mar 12, 2025, 11:20 PM",
  "Mar 9": "Mar 9, 2025, 08:30 PM",
};

const auditLog: AuditLogItem[] = [
  { detail: "Mar 11, 2025 at 14:15 - Employee", event: "Request submitted" },
  { detail: "Mar 11, 2025 at 14:10 - Employee", event: "Contract accepted" },
  { detail: "Mar 11, 2025 at 14:15 - System", event: "Eligibility validated" },
  {
    detail: "Mar 11, 2025 at 14:15 - System",
    event: "Routed to Finance review",
  },
];

const eligibilityChecks = [
  "Employment Status",
  "Tenure 24+ Months",
  "OKR Submitted",
];

const contractByStatus: Record<RequestStatus, ContractInfo> = {
  approved: {
    acceptedAt: "Mar 11, 2025, 10:10 PM",
    status: "Accepted",
    version: "v1.3",
  },
  pending: {
    acceptedAt: "Mar 11, 2025, 10:10 PM",
    status: "Accepted",
    version: "v1.3",
  },
  rejected: {
    acceptedAt: "Mar 9, 2025, 08:20 PM",
    status: "Accepted",
    version: "v1.2",
  },
};

export function getBenefitReviewDetail(
  row: BenefitRequestRow,
): BenefitReviewDetail {
  return {
    approvalRoute: `${row.approvedBy} Review`,
    auditLog,
    category: row.category,
    contract: contractByStatus[row.status],
    eligibilityChecks,
    employee: row.employee,
    position: row.position,
    progress: row.progress,
    snapshot: [
      { label: "Role", value: row.position },
      { label: "Department", value: row.approvedBy === "HR" ? "People Ops" : "Finance" },
      { label: "Level", value: "Level 1" },
      { label: "OKR", value: "Submitted" },
      { label: "Status", value: "active" },
      { label: "Late Arrivals", value: "0 (30 days)" },
    ],
    status: row.status,
    submittedAt: submittedAtMap[row.submitted] ?? `${row.submitted}, 2025`,
    subtitle: "Review and approve or reject this benefit request.",
    title: row.benefit,
  };
}
