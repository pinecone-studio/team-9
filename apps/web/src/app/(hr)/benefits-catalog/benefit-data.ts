import {
  BadgePercent,
  StickyNote,
} from "lucide-react";
import {
  ApprovalActionType,
  ApprovalEntityType,
  ApprovalRequestStatus,
  type ApprovalRequestsQuery,
} from "@/shared/apollo/generated";

import type {
  BenefitBadge,
  BenefitCategory,
  BenefitCatalogRecord,
  PendingBenefitRequest,
  BenefitSection,
} from "./benefit-types";
import {
  cardIconMatchers,
  DEFAULT_CARD_ICON,
  DEFAULT_SECTION_ICON,
  findMatchingBenefitIcon,
  sectionIconMatchers,
} from "./benefit-data-icons";

export type {
  BenefitBadge,
  BenefitCategory,
  BenefitCard,
  BenefitCatalogRecord,
  BenefitSection,
} from "./benefit-types";

function buildBadges(record: BenefitCatalogRecord): BenefitBadge[] {
  const normalizedVendorName = record.vendorName?.trim() ?? "";
  const badges: BenefitBadge[] = [];

  if (
    typeof record.subsidyPercent === "number" &&
    Number.isFinite(record.subsidyPercent)
  ) {
    badges.push({
      icon: BadgePercent,
      label: `${record.subsidyPercent}% OFF`,
      weight: "semibold",
    });
  }

  if (normalizedVendorName) {
    badges.push({
      icon: StickyNote,
      label: normalizedVendorName,
      weight: "medium",
    });
  } else {
    badges.push({
      icon: StickyNote,
      label: "No vendor",
      weight: "medium",
    });
  }

  return badges;
}

export function buildBenefitSections(
  benefits: BenefitCatalogRecord[],
  categories: BenefitCategory[] = [],
  approvalRequests: ApprovalRequestsQuery["approvalRequests"] = [],
): BenefitSection[] {
  const groupedBenefits = new Map<
    string,
    { categoryId: string; categoryName: string; records: BenefitCatalogRecord[] }
  >();

  benefits.forEach((benefit) => {
    const categoryName = benefit.category.trim() || "General";
    const categoryId = benefit.categoryId || categoryName;
    const group = groupedBenefits.get(categoryId) ?? {
      categoryId,
      categoryName,
      records: [],
    };
    group.records.push(benefit);
    groupedBenefits.set(categoryId, group);
  });

  categories.forEach((category) => {
    const categoryName = category.name.trim();
    const categoryId = category.id.trim();

    if (!categoryName || !categoryId || groupedBenefits.has(categoryId)) {
      return;
    }

    groupedBenefits.set(categoryId, {
      categoryId,
      categoryName,
      records: [],
    });
  });

  return Array.from(groupedBenefits.values())
    .sort((left, right) => left.categoryName.localeCompare(right.categoryName))
    .map(({ categoryId, categoryName, records }) => {
      const sectionIcon = findMatchingBenefitIcon(
        categoryName,
        sectionIconMatchers,
        DEFAULT_SECTION_ICON,
      );

      return {
        categoryId,
        title: categoryName,
        count: `${records.length} Benefit${records.length === 1 ? "" : "s"}`,
        icon: sectionIcon,
        cards: records.map((record) => {
          const pendingRequest = approvalRequests
            .filter(
              (request) =>
                request.entity_type === ApprovalEntityType.Benefit &&
                request.entity_id === record.id &&
                request.status === ApprovalRequestStatus.Pending &&
                (request.action_type === ApprovalActionType.Update ||
                  request.action_type === ApprovalActionType.Delete),
            )
            .sort((left, right) => right.created_at.localeCompare(left.created_at))[0];

          return {
            activeEmployees: Math.max(0, record.activeEmployees ?? 0),
            id: record.id,
            approvalRole: record.approvalRole,
            category: categoryName,
            categoryId: record.categoryId,
            title: record.title,
            icon: findMatchingBenefitIcon(
              `${record.title} ${categoryName}`,
              cardIconMatchers,
              DEFAULT_CARD_ICON,
            ),
            enabled: record.isActive,
            isCore: record.isCore,
            eligibleEmployees: Math.max(0, record.eligibleEmployees ?? 0),
            pendingRequest: pendingRequest
              ? ({
                  actionType: pendingRequest.action_type,
                  createdAt: pendingRequest.created_at,
                  id: pendingRequest.id,
                  requestedBy: pendingRequest.requested_by,
                  status: pendingRequest.status,
                  targetRole: pendingRequest.target_role,
                } satisfies PendingBenefitRequest)
              : null,
            requiresContract: record.requiresContract,
            subsidyPercent: record.subsidyPercent,
            vendorName: record.vendorName ?? null,
            badges: buildBadges(record),
            description: record.description,
          };
        }),
      };
    });
}
