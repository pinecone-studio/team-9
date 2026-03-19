import { CircleX, Shield } from "lucide-react";
import type { ReactNode, SVGProps } from "react";

import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import { formatApprovalRole, formatApprovalRoleShort } from "./approval-request-utils";

type StatusValue = ApprovalRequestRecord["status"] | BenefitRequestRecord["status"];

function BenefitTypeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6.53323 7.11165C6.62266 7.14084 6.71905 7.14084 6.80848 7.11165C7.55291 6.86562 8.19941 6.38807 8.65378 5.74857C9.10816 5.10908 9.34668 4.34106 9.33458 3.5564C9.34193 2.77552 9.10121 2.01249 8.64717 1.37746C8.19313 0.742435 7.54925 0.268256 6.80848 0.0233704C6.71937 -0.00779015 6.62234 -0.00779015 6.53323 0.0233704C5.79246 0.268256 5.14858 0.742435 4.69454 1.37746C4.2405 2.01249 3.99978 2.77552 4.00714 3.5564C3.99504 4.34106 4.23355 5.10908 4.68793 5.74857C5.1423 6.38807 5.7888 6.86562 6.53323 7.11165Z" fill="currentColor" />
      <path d="M3.56318 6.07618C3.11773 5.70388 2.56596 5.48228 1.98697 5.44317C1.40798 5.40405 0.831475 5.54941 0.340081 5.85842C0.260565 5.91058 0.199873 5.98691 0.16694 6.07618C-0.0323549 6.62211 -0.053781 7.2172 0.105735 7.77608C0.265251 8.33496 0.597511 8.82889 1.05485 9.18702C1.55724 9.59506 2.18371 9.81925 2.83066 9.82253C3.34436 9.81677 3.84543 9.66243 4.27351 9.37812C4.35229 9.32711 4.4129 9.25244 4.44665 9.1648C4.6399 8.62209 4.65861 8.03244 4.50018 7.47854C4.34174 6.92464 4.01409 6.43426 3.56318 6.07618Z" fill="currentColor" />
      <path d="M8.57098 10.1469C8.33151 9.99233 8.1479 9.76491 8.04711 9.49811L7.11481 10.2225V7.92491H7.07929C6.94811 7.97198 6.81018 7.99749 6.67086 8.00046C6.53241 7.99969 6.39482 7.97873 6.26242 7.93824H6.2269V10.2225L5.29904 9.49811C5.19709 9.76555 5.01185 9.99305 4.77074 10.1469L4.73966 10.1692L6.2269 11.3291V12.8889C6.2269 13.0068 6.27368 13.1198 6.35693 13.2032C6.44019 13.2865 6.55311 13.3333 6.67086 13.3333C6.7886 13.3333 6.90152 13.2865 6.98478 13.2032C7.06804 13.1198 7.11481 13.0068 7.11481 12.8889V11.3291L8.60649 10.1692L8.57098 10.1469Z" fill="currentColor" />
      <path d="M13.157 6.07618C13.1241 5.98691 13.0634 5.91058 12.9839 5.85842C12.4898 5.56212 11.9166 5.4252 11.3422 5.46623C10.7677 5.50726 10.2198 5.72426 9.77274 6.08778C9.32572 6.45129 9.00128 6.9437 8.84346 7.49816C8.68565 8.05262 8.70212 8.64226 8.89062 9.18702C8.92437 9.27466 8.98498 9.34933 9.06376 9.40034C9.49184 9.68465 9.99291 9.83899 10.5066 9.84474C11.1536 9.84147 11.78 9.61728 12.2824 9.20924C12.7421 8.84796 13.0747 8.34941 13.2319 7.78599C13.3892 7.22258 13.363 6.62364 13.157 6.07618Z" fill="currentColor" />
    </svg>
  );
}

function RuleTypeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.33333 3.88667C7.9 3.68667 8.35333 3.23333 8.55333 2.66667H10.6667L8.66667 7.33333C8.66667 8.44 9.71333 9.33333 11 9.33333C12.2867 9.33333 13.3333 8.44 13.3333 7.33333L11.3333 2.66667H12.6667V1.33333H8.55333C8.28 0.553333 7.54 0 6.66667 0C5.79333 0 5.05333 0.553333 4.78 1.33333H0.666667V2.66667H2L0 7.33333C0 8.44 1.04667 9.33333 2.33333 9.33333C3.62 9.33333 4.66667 8.44 4.66667 7.33333L2.66667 2.66667H4.78C4.98 3.23333 5.43333 3.68667 6 3.88667V11.3333H0V12.6667H13.3333V11.3333H7.33333V3.88667ZM12.2467 7.33333H9.75333L11 4.42667L12.2467 7.33333ZM3.58 7.33333H1.08667L2.33333 4.42667L3.58 7.33333ZM6.66667 2.66667C6.3 2.66667 6 2.36667 6 2C6 1.63333 6.3 1.33333 6.66667 1.33333C7.03333 1.33333 7.33333 1.63333 7.33333 2C7.33333 2.36667 7.03333 2.66667 6.66667 2.66667Z" fill="currentColor" />
    </svg>
  );
}

function PendingStatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="6" cy="6" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 3.25V6.1L7.95 7.3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ApprovedStatusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="6" cy="6" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.6 6.15L5.2 7.75L8.4 4.55" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function TypeChip({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 font-sans">
      <span className="inline-flex h-4 w-4 items-center justify-center text-[#737373]">{icon}</span>
      <span className="inline-flex h-[28px] items-center justify-center rounded-[10px] border border-[#E5E5E5] bg-white px-[11px] py-[4px] text-[14px] leading-5 font-medium text-[#171717]">
        {children}
      </span>
    </div>
  );
}

export function RequestStatusBadge({ status }: { status: StatusValue }) {
  if (status === "approved") {
    return <span className="inline-flex h-[22px] items-center justify-center gap-[6px] rounded-[4px] bg-[#DCFCE7] px-2 py-[2px] font-sans text-[12px] leading-4 font-medium whitespace-nowrap text-[#016630]"><ApprovedStatusIcon className="h-3 w-3 shrink-0" />Approved</span>;
  }
  if (status === "rejected" || status === "cancelled") {
    return <span className="inline-flex h-[22px] items-center justify-center gap-[6px] rounded-[4px] border border-[#FFA2A2] bg-[#FEF2F2] px-2 py-[2px] font-sans text-[12px] leading-4 font-medium whitespace-nowrap text-[#C10007]"><CircleX className="h-3 w-3 shrink-0" />{status === "cancelled" ? "Cancelled" : "Rejected"}</span>;
  }
  return <span className="inline-flex h-[22px] items-center justify-center gap-[6px] rounded-[4px] bg-[#FEF3C6] px-2 py-[2px] font-sans text-[12px] leading-4 font-medium whitespace-nowrap text-[#973C00]"><PendingStatusIcon className="h-3 w-3 shrink-0" />Pending Approval</span>;
}

export function EntityTypeBadge({ request }: { request: ApprovalRequestRecord }) {
  if (request.entity_type === "benefit") {
    return <TypeChip icon={<BenefitTypeIcon className="h-[14px] w-[14px]" />}>Benefit</TypeChip>;
  }
  return <TypeChip icon={<RuleTypeIcon className="h-[14px] w-[14px]" />}>Rule</TypeChip>;
}

export function OverrideTypeBadge() {
  return <TypeChip icon={<Shield className="h-[14px] w-[14px] stroke-[1.8]" />}>Override</TypeChip>;
}

export function isAssignedToCurrentRole({
  currentUserRole,
  reviewTarget,
  status,
}: {
  currentUserRole: string;
  reviewTarget: ApprovalRequestRecord["target_role"] | BenefitRequestRecord["approval_role"];
  status: StatusValue;
}) {
  return status === "pending" && String(reviewTarget).trim().toLowerCase() === currentUserRole.trim().toLowerCase();
}

export function AssigneeLabel(props: {
  currentUserRole: string;
  reviewTarget: ApprovalRequestRecord["target_role"] | BenefitRequestRecord["approval_role"];
  reviewerName: string | null;
  status: StatusValue;
}) {
  const { currentUserRole, reviewTarget, reviewerName } = props;
  const matchesCurrentRole = String(reviewTarget).trim().toLowerCase() === currentUserRole.trim().toLowerCase();
  const label = reviewerName ? reviewerName : matchesCurrentRole ? formatApprovalRoleShort(reviewTarget) : formatApprovalRole(reviewTarget);

  return (
    <span className={`inline-flex max-w-full truncate font-sans text-[16px] leading-6 ${matchesCurrentRole && !reviewerName ? "font-medium text-[#2563EB]" : "font-normal text-[#737373]"}`}>
      {label}
    </span>
  );
}
