"use client";

import { useApolloClient } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";
import { useBenefitCatalogPageQuery } from "@/shared/apollo/generated";
import {
  BenefitContractForContractsDocument,
  buildContractRow,
  formatDate,
  deriveStatus,
} from "./contracts-helpers";
import type {
  BackendContract,
  BenefitContractForContractsQuery,
  ContractRow,
} from "./contracts-types";

export function useContractsData(searchText: string) {
  const apolloClient = useApolloClient();
  const [contractsByBenefitId, setContractsByBenefitId] = useState<
    Record<string, BackendContract | null>
  >({});
  const [contractsLoading, setContractsLoading] = useState(false);
  const { data, loading } = useBenefitCatalogPageQuery({
    fetchPolicy: "cache-and-network",
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

  useEffect(() => {
    let isCancelled = false;
    if (contractBenefitIds.length === 0) {
      setContractsByBenefitId({});
      setContractsLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    const fetchContracts = async () => {
      setContractsLoading(true);
      try {
        const entries = await Promise.all(
          contractBenefitIds.map(async (benefitId) => {
            const result = await apolloClient.query<BenefitContractForContractsQuery>({
              fetchPolicy: "network-only",
              query: BenefitContractForContractsDocument,
              variables: { benefitId },
            });
            return [benefitId, result.data?.benefitContract ?? null] as const;
          }),
        );

        if (!isCancelled) {
          setContractsByBenefitId(Object.fromEntries(entries));
        }
      } catch {
        if (!isCancelled) {
          setContractsByBenefitId({});
        }
      } finally {
        if (!isCancelled) {
          setContractsLoading(false);
        }
      }
    };

    void fetchContracts();

    return () => {
      isCancelled = true;
    };
  }, [apolloClient, contractBenefitIds]);

  const contractRows = useMemo<ContractRow[]>(() => {
    const summaryByBenefitId = new Map(
      (data?.listBenefitEligibilitySummary ?? []).map((summary) => [summary.benefitId, summary]),
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
          acceptedCount: summary?.eligibleEmployees ?? 0,
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
  }, [allBenefits, contractBenefitIds, contractsByBenefitId, data?.listBenefitEligibilitySummary]);

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
          summary.eligibleEmployees ?? 0,
        ]),
      ),
    [data?.listBenefitEligibilitySummary],
  );
  const isInitialContractsLoading =
    (loading && !data) ||
    (contractBenefitIds.length > 0 &&
      contractsLoading &&
      Object.keys(contractsByBenefitId).length === 0);
  return {
    acceptedCountByBenefitId,
    allBenefits,
    benefitOptions,
    contractsByBenefitId,
    contractRows,
    contractsLoading,
    filteredRows,
    isInitialContractsLoading,
    loading,
    setContractsByBenefitId,
  };
}
