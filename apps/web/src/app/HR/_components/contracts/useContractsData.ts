"use client";

import { useMemo, useState } from "react";
import { useBenefitCatalogPageQuery } from "@/shared/apollo/generated";
import {
  formatDate,
  deriveStatus,
} from "./contracts-helpers";
import type {
  BackendContract,
  ContractRow,
} from "./contracts-types";

export function useContractsData(searchText: string) {
  const [contractsByBenefitId, setContractsByBenefitId] = useState<
    Record<string, BackendContract | null>
  >({});
  const { data, loading } = useBenefitCatalogPageQuery({
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const allBenefits = useMemo(
    () =>
      (data?.allBenefits ?? []).filter(
        (benefit): benefit is NonNullable<typeof benefit> => Boolean(benefit),
      ),
    [data?.allBenefits],
  );

  const contractBenefitIds = useMemo(
    () =>
      allBenefits
        .filter((benefit) => benefit.requiresContract)
        .map((benefit) => benefit.id),
    [allBenefits],
  );
  const queriedContractsByBenefitId = useMemo(
    () =>
      Object.fromEntries(
        (data?.activeBenefitContracts ?? []).map((contract) => [contract.benefitId, contract]),
      ) as Record<string, BackendContract | null>,
    [data?.activeBenefitContracts],
  );
  const resolvedContractsByBenefitId = useMemo(
    () => ({ ...queriedContractsByBenefitId, ...contractsByBenefitId }),
    [contractsByBenefitId, queriedContractsByBenefitId],
  );

  const contractRows = useMemo<ContractRow[]>(() => {
    const summaryByBenefitId = new Map(
      (data?.listBenefitEligibilitySummary ?? []).map((summary) => [summary.benefitId, summary]),
    );
    const benefitsById = new Map(allBenefits.map((benefit) => [benefit.id, benefit]));

    return contractBenefitIds.flatMap((benefitId) => {
      const contract = resolvedContractsByBenefitId[benefitId];
      const benefit = benefitsById.get(benefitId);

      if (!contract || !benefit) {
        return [];
      }

      const summary = summaryByBenefitId.get(benefit.id);

      return [
        {
          acceptedCount: summary?.activeEmployees ?? 0,
          benefit: benefit.title,
          benefitId: benefit.id,
          effectiveDate: formatDate(contract.effectiveDate),
          expiryDate: formatDate(contract.expiryDate),
          status: deriveStatus(contract),
          vendor: contract.vendorName?.trim() || benefit.vendorName?.trim() || "-",
          version: contract.version?.trim() || "v1.0",
        },
      ];
    });
  }, [allBenefits, contractBenefitIds, data?.listBenefitEligibilitySummary, resolvedContractsByBenefitId]);

  const filteredRows = useMemo(() => {
    const term = searchText.trim().toLowerCase();

    if (!term) {
      return contractRows;
    }

    return contractRows.filter((row) =>
      [
        row.benefit,
        row.vendor,
        row.version,
        row.status,
        `${row.acceptedCount} accepted`,
        row.effectiveDate,
        row.expiryDate,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [contractRows, searchText]);

  const benefitOptions = useMemo(
    () =>
      allBenefits
        .filter((benefit) => benefit.requiresContract)
        .map((benefit) => ({
          id: benefit.id,
          label: benefit.title,
          vendorName: benefit.vendorName,
        })),
    [allBenefits],
  );

  const acceptedCountByBenefitId = useMemo(
    () =>
      new Map(
        (data?.listBenefitEligibilitySummary ?? []).map((summary) => [
          summary.benefitId,
          summary.activeEmployees ?? 0,
        ]),
      ),
    [data?.listBenefitEligibilitySummary],
  );
  const isInitialContractsLoading = loading && !data;
  return {
    acceptedCountByBenefitId,
    allBenefits,
    benefitOptions,
    contractRows,
    contractsLoading: loading,
    filteredRows,
    isInitialContractsLoading,
    loading,
    setContractsByBenefitId,
  };
}
