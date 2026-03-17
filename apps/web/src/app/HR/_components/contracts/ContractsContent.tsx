"use client";

import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";
import { useBenefitCatalogPageQuery } from "@/shared/apollo/generated";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpFromLine,
  CheckCircle2,
  Eye,
  FileClock,
  FileText,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

type ContractStatus = "active" | "expiring" | "expired" | "archived";

type BackendContract = {
  benefitId: string;
  effectiveDate: string;
  expiryDate: string;
  id: string;
  isActive: boolean;
  vendorName: string;
  version: string;
};

type ContractRow = {
  accepted: string;
  benefit: string;
  benefitId: string;
  effectiveDate: string;
  expiryDate: string;
  status: ContractStatus;
  vendor: string;
  version: string;
};

type ContractKpiCard = {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: number;
};

const BenefitContractForContractsDocument = gql`
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

type BenefitContractForContractsQuery = {
  benefitContract: BackendContract | null;
};

function formatDate(value: string) {
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

function deriveStatus(contract: BackendContract): ContractStatus {
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

function renderStatusBadge(status: ContractStatus) {
  if (status === "active") {
    return (
      <span className="inline-flex h-[22px] min-w-[54px] items-center justify-center rounded-[8px] bg-[#DCFCE7] px-2 text-[12px] leading-4 font-medium text-[#016630]">
        Active
      </span>
    );
  }

  if (status === "expiring") {
    return (
      <span className="inline-flex h-[22px] min-w-[96px] items-center justify-center rounded-[8px] bg-[#FEF3C6] px-2 text-[12px] leading-4 font-medium text-[#973C00]">
        Expiring Soon
      </span>
    );
  }

  if (status === "expired") {
    return (
      <span className="inline-flex h-[22px] min-w-[61px] items-center justify-center rounded-[8px] bg-[#E7000B] px-2 text-[12px] leading-4 font-medium text-white">
        Expired
      </span>
    );
  }

  return (
    <span className="inline-flex h-[22px] min-w-[68px] items-center justify-center rounded-[8px] bg-[#F5F5F5] px-2 text-[12px] leading-4 font-medium text-[#171717]">
      Archived
    </span>
  );
}

function KpiCard({ icon: Icon, iconClassName, label, value }: ContractKpiCard) {
  return (
    <article className="box-border flex h-[74px] flex-1 items-start rounded-[14px] border border-[#E5E5E5] bg-white py-3 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex h-12 w-full items-center justify-between px-4">
        <div className="flex h-12 flex-col items-start">
          <p className="h-4 text-[12px] leading-4 font-medium text-[#737373]">{label}</p>
          <p className="h-8 text-[24px] leading-8 font-semibold text-[#0A0A0A]">{value}</p>
        </div>
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
    </article>
  );
}

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

  const contractRows = useMemo<ContractRow[]>(() => {
    const summaryByBenefitId = new Map(
      (data?.listBenefitEligibilitySummary ?? []).map((summary) => [
        summary.benefitId,
        summary,
      ]),
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
          accepted: `${summary?.eligibleEmployees ?? 0} accepted`,
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
        row.accepted,
        row.effectiveDate,
        row.expiryDate,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [contractRows, searchText]);

  const kpiCards: ContractKpiCard[] = useMemo(
    () => [
      {
        icon: CheckCircle2,
        iconClassName: "text-[#00C950]",
        label: "Active Contracts",
        value: contractRows.filter((row) => row.status === "active").length,
      },
      {
        icon: FileClock,
        iconClassName: "text-[#FD9A00]",
        label: "Expiring Soon",
        value: contractRows.filter((row) => row.status === "expiring").length,
      },
      {
        icon: FileText,
        iconClassName: "text-[#737373]",
        label: "Archived Versions",
        value: contractRows.filter((row) => row.status === "archived").length,
      },
      {
        icon: Users,
        iconClassName: "text-[#737373]",
        label: "Acceptances This Month",
        value: 0,
      },
    ],
    [contractRows],
  );

  return (
    <section className="flex h-[610.5px] w-full max-w-[1280px] flex-col items-start gap-5 py-6">
      <div className="flex h-[74px] w-full items-start gap-3">
        {kpiCards.map((card) => (
          <KpiCard key={card.label} {...card} />
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

      <section className="box-border flex h-[412.5px] w-full flex-col overflow-hidden rounded-[10px] border border-[#E5E5E5] bg-white">
        <div className="h-[410.5px] w-full overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[201.11px]" />
              <col className="w-[125.54px]" />
              <col className="w-[68.98px]" />
              <col className="w-[114.46px]" />
              <col className="w-[106.12px]" />
              <col className="w-[118.36px]" />
              <col className="w-[171.03px]" />
              <col className="w-[324.41px]" />
            </colgroup>
            <thead>
              <tr className="h-[41px] border-b border-[#E5E5E5] text-[14px] leading-5 font-medium text-[#0A0A0A]">
                <th className="px-2 py-[9.75px] pb-[10.25px]">Benefit</th>
                <th className="px-2 py-[9.75px] pb-[10.25px]">Vendor</th>
                <th className="px-2 py-[9.75px] pb-[10.25px]">Version</th>
                <th className="px-2 py-[9.75px] pb-[10.25px]">Effective Date</th>
                <th className="px-2 py-[9.75px] pb-[10.25px]">Expiry Date</th>
                <th className="px-2 py-[9.75px] pb-[10.25px]">Status</th>
                <th className="px-2 py-[9.75px] pb-[10.25px]">Accepted This Version</th>
                <th className="px-[18px] py-[9.75px] pb-[10.25px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr
                  className={`${
                    index === filteredRows.length - 1 ? "h-[52.5px]" : "h-[54px]"
                  } border-b border-[#E5E5E5]`}
                  key={row.benefitId}
                >
                  <td className="px-2 py-[16.5px] text-[14px] leading-5 font-medium text-[#0A0A0A]">{row.benefit}</td>
                  <td className="px-2 py-[16.5px] text-[14px] leading-5 text-[#737373]">{row.vendor}</td>
                  <td className="overflow-hidden px-2 py-[15.5px]">
                    <span className="inline-flex h-[22px] max-w-[52px] items-center justify-center overflow-hidden rounded-[8px] border border-[#E5E5E5] px-2 text-[12px] leading-4 font-medium text-[#0A0A0A] text-ellipsis whitespace-nowrap">
                      {row.version}
                    </span>
                  </td>
                  <td className="px-2 py-[16.5px] text-[14px] leading-5 whitespace-nowrap text-[#737373]">
                    {row.effectiveDate}
                  </td>
                  <td className="px-2 py-[16.5px] text-[14px] leading-5 whitespace-nowrap text-[#737373]">
                    {row.expiryDate}
                  </td>
                  <td className="px-2 py-[15.5px]">{renderStatusBadge(row.status)}</td>
                  <td className="px-2 py-[16.5px] text-[14px] leading-5 text-[#737373]">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-[14px] w-[14px]" />
                      {row.accepted}
                    </span>
                  </td>
                  <td className="px-0 py-[11px] pr-[18px]">
                    <div className="flex h-8 items-center justify-end gap-1">
                      <button
                        className="inline-flex h-8 min-w-[75px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]"
                        type="button"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        className="inline-flex h-8 min-w-[122px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]"
                        type="button"
                      >
                        <ArrowUpFromLine className="h-4 w-4" />
                        Upload New
                      </button>
                      {row.status === "expired" ? (
                        <button
                          className="inline-flex h-8 min-w-[87px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]"
                          type="button"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Renew
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !contractsLoading && filteredRows.length === 0 ? (
                <tr className="h-[54px] border-b border-[#E5E5E5]">
                  <td className="px-4 text-[14px] text-[#737373]" colSpan={8}>
                    No contract benefits found.
                  </td>
                </tr>
              ) : null}
              {contractsLoading ? (
                <tr className="h-[54px] border-b border-[#E5E5E5]">
                  <td className="px-4 text-[14px] text-[#737373]" colSpan={8}>
                    Loading contracts...
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
