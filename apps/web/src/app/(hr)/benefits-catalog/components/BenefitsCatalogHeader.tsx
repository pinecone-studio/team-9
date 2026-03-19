import { CheckCircle2, List, Search } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import {
  ApprovalActionType,
  ApprovalEntityType,
  ApprovalRequestStatus,
  useApprovalRequestsQuery,
} from "@/shared/apollo/generated";

import { isArchivedBenefit } from "../benefit-data-approval";
import { BENEFIT_CATALOG_QUERY, type BenefitCatalogQuery } from "./wellness-section.graphql";

type BenefitsCatalogHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export default function BenefitsCatalogHeader({
  searchQuery,
  onSearchChange,
}: BenefitsCatalogHeaderProps) {
  const { data } = useQuery<BenefitCatalogQuery>(BENEFIT_CATALOG_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });
  const { data: approvalRequestsData } = useApprovalRequestsQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });
  const approvalRequests = approvalRequestsData?.approvalRequests ?? [];
  const allBenefits = (data?.allBenefits ?? []).flatMap((benefit) => {
    if (!benefit || isArchivedBenefit(benefit.id, approvalRequests)) {
      return [];
    }

    return [benefit];
  });
  const summary = {
    activeBenefits: allBenefits.filter((benefit) => benefit.isActive).length,
    inactiveBenefits: allBenefits.filter((benefit) => !benefit.isActive).length,
    pendingBenefits: approvalRequests.filter(
      (request) =>
        request.entity_type === ApprovalEntityType.Benefit &&
        request.status === ApprovalRequestStatus.Pending &&
        (request.action_type === ApprovalActionType.Create ||
          request.action_type === ApprovalActionType.Update ||
          request.action_type === ApprovalActionType.Delete),
    ).length,
    totalCategories: data?.benefitCategories.length ?? 0,
  };

  const cards = [
    {
      label: "Active Benefits",
      value: summary.activeBenefits,
      icon: <CheckCircle2 className="h-7 w-7 text-white" />,
    },
    {
      label: "Total Categories",
      value: summary.totalCategories,
      icon: <List className="h-7 w-7 text-white" />,
    },
    {
      label: "Inactive Benefits",
      value: summary.inactiveBenefits,
      icon: <List className="h-7 w-7 text-white" />,
    },
    {
      label: "Pending Benefits",
      value: summary.pendingBenefits,
      icon: <List className="h-7 w-7 text-white" />,
    },
  ];

  return (
    <section className="mx-auto flex w-full max-w-[1300px] flex-col items-center gap-[31px] px-4 pt-[18px] sm:px-0">
      <div className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-[16px] px-[30px] py-[50px] shadow-[0_24px_48px_rgba(25,43,107,0.22)]">
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/contracts-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,130,255,0.08),rgba(18,27,83,0.18))]" />
        <div className="absolute inset-0 rounded-[16px] border border-[#2EA8FF]" />

        <div className="relative flex w-full max-w-[560px] flex-col items-center gap-[5px]">
          <h1 className="w-full text-center text-[24px] leading-[31px] font-semibold text-white">
            Benefits Catalog
          </h1>
          <p className="w-full text-center text-[14px] leading-[18px] font-normal text-white">
            Manage company benefits and their configurations
          </p>
        </div>

        <div className="relative grid w-full gap-5 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              className="flex min-h-[92px] flex-col justify-between rounded-[12px] border border-white/25 bg-black/10 p-6 text-white backdrop-blur-[2px]"
              key={card.label}
            >
              <div className="text-[14px] leading-5 font-medium text-white">{card.label}</div>
              <div className="flex items-end justify-between gap-4">
                <span className="text-[42px] leading-9 font-bold text-white">{card.value}</span>
                <span className="shrink-0">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-0">
        <div className="flex h-9 w-full max-w-[463px] items-center gap-2 rounded-[4px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Search className="h-4 w-4 shrink-0 text-[#51565B]" />
          <input
            aria-label="Search benefits"
            className="h-[18px] w-full border-none bg-transparent text-[14px] leading-[18px] font-normal text-[#51565B] outline-none placeholder:text-[#51565B]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search benefits..."
            type="text"
            value={searchQuery}
          />
        </div>
      </div>
    </section>
  );
}
