import {
  BadgePercent,
  StickyNote,
} from "lucide-react";
import {
  type ApprovalRequestsQuery,
} from "@/shared/apollo/generated";

import type {
  BenefitBadge,
  BenefitCategory,
  BenefitCatalogRecord,
  BenefitSection,
} from "./benefit-types";
import {
  cardIconMatchers,
  type CategoryIconKey,
  DEFAULT_CARD_ICON,
  DEFAULT_SECTION_ICON,
  findMatchingBenefitIcon,
  getCategoryIconByKey,
  sectionIconMatchers,
} from "./benefit-data-icons";
import {
  getPendingBenefitCreateRecords,
  getPendingBenefitRequest,
  isArchivedBenefit,
} from "./benefit-data-approval";
import { normalizePendingBenefitRequest } from "./benefit-data-pending";

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
  categoryIconKeys: Partial<Record<string, CategoryIconKey>> = {},
): BenefitSection[] {
  const pendingCreateRecords = getPendingBenefitCreateRecords(categories, approvalRequests);
  const groupedBenefits = new Map<
    string,
    { categoryId: string; categoryName: string; records: BenefitCatalogRecord[] }
  >();

  [...benefits, ...pendingCreateRecords].forEach((benefit) => {
    if (isArchivedBenefit(benefit.id, approvalRequests)) {
      return;
    }

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
      const customIconKey = categoryIconKeys[categoryId];
      const sectionIcon = customIconKey
        ? getCategoryIconByKey(customIconKey)
        : findMatchingBenefitIcon(
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
          const pendingRequest = normalizePendingBenefitRequest(
            record.pendingRequest ?? getPendingBenefitRequest(record.id, approvalRequests),
          );

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
            pendingRequest,
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
