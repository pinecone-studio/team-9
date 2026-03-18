"use client";

import { useApolloClient } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";
import { useBenefitCatalogPageQuery } from "@/shared/apollo/generated";
import { Search } from "lucide-react";

import ContractsKpiCard from "./ContractsKpiCard";
import ContractsTable from "./ContractsTable";
import {
  buildContractKpiCards,
  buildContractRows,
  filterContractRows,
  type BackendContract,
  type CatalogBenefit,
} from "./contracts-content.helpers";
import {
  BenefitContractForContractsDocument,
  type BenefitContractForContractsQuery,
} from "./contracts-content.graphql";

export default function ContractsContent() {
  const apolloClient = useApolloClient();
  const [searchText, setSearchText] = useState("");
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
        (benefit): benefit is CatalogBenefit => Boolean(benefit),
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

        if (isCancelled) {
          return;
        }

        setContractsByBenefitId(Object.fromEntries(entries));
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

  const contractRows = useMemo(
    () =>
      buildContractRows({
        allBenefits,
        contractBenefitIds,
        contractsByBenefitId,
        summaries: data?.listBenefitEligibilitySummary ?? [],
      }),
    [allBenefits, contractBenefitIds, contractsByBenefitId, data?.listBenefitEligibilitySummary],
  );
  const filteredRows = useMemo(
    () => filterContractRows(contractRows, searchText),
    [contractRows, searchText],
  );
  const kpiCards = useMemo(() => buildContractKpiCards(contractRows), [contractRows]);

  return (
    <section className="flex h-[610.5px] w-full max-w-[1280px] flex-col items-start gap-5 py-6">
      <div className="flex h-[74px] w-full items-start gap-3">
        {kpiCards.map((card) => (
          <ContractsKpiCard key={card.label} {...card} />
        ))}
      </div>

      <div className="flex h-9 w-full items-center">
        <label className="relative block h-9 w-full max-w-96">
          <input
            className="h-9 w-full rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] py-2 pr-3 pl-9 text-[14px] leading-[18px] text-[#737373] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by benefit or vendor..."
            type="text"
            value={searchText}
          />
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#737373]" />
        </label>
      </div>

      <ContractsTable loading={loading || contractsLoading} rows={filteredRows} />
    </section>
  );
}
