"use client";
/* eslint-disable max-lines */
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  EmployeeBenefitRequestsDocument,
  EmployeeDashboardDataDocument,
  useContractSignedUrlByBenefitLazyQuery,
  useEmployeeBenefitDialogQuery,
  useSubmitEmployeeBenefitRequestMutation,
} from "@/shared/apollo/generated";
import { getBadgeClass, StatusBadgeIcon } from "./benefit-card-ui";
import { buildBenefitDialogRuleItems, resolveSignedContractUrl } from "./employee-benefit-dialog.helpers";
import EmployeeBenefitDialogContractSection from "./EmployeeBenefitDialogContractSection";
import EmployeeBenefitDialogEligibilitySection from "./EmployeeBenefitDialogEligibilitySection";
import type { EmployeeBenefitCard } from "./employee-types";
type EmployeeBenefitDialogProps = { card: EmployeeBenefitCard; currentUserIdentifier: string; employeeId: string; onClose: () => void; onSubmitted: () => Promise<unknown> | void };

export default function EmployeeBenefitDialog({
  card,
  currentUserIdentifier,
  employeeId,
  onClose,
  onSubmitted,
}: EmployeeBenefitDialogProps) {
  const [acceptedContract, setAcceptedContract] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data, error, loading } = useEmployeeBenefitDialogQuery({
    fetchPolicy: "network-only",
    variables: { benefitId: card.id },
  });
  const [fetchSignedUrl, { loading: contractLoading }] =
    useContractSignedUrlByBenefitLazyQuery({ fetchPolicy: "network-only" });
  const [submitEmployeeBenefitRequest, { loading: submitting }] =
    useSubmitEmployeeBenefitRequestMutation();
  const contract = data?.benefitContract ?? null;
  const eligibilityItems = buildBenefitDialogRuleItems(card, data?.eligibilityRules ?? []);
  const isSubmitDisabled = loading || submitting || (card.requiresContract && !acceptedContract);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  async function handleViewContract() {
    if (!contract) {
      setErrorMessage("No active contract is attached to this benefit.");
      return;
    }
    setErrorMessage(null);
    try {
      const response = await fetchSignedUrl({ variables: { benefitId: card.id } });
      const signedUrl = response.data?.contractSignedUrlByBenefit.signedUrl;
      if (!signedUrl) {
        throw new Error("Contract link could not be created.");
      }
      window.open(resolveSignedContractUrl(signedUrl), "_blank", "noopener,noreferrer");
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error
          ? requestError.message
          : "Contract could not be opened.",
      );
    }
  }

  async function handleSubmit() {
    if (card.requiresContract && !contract) {
      setErrorMessage("No active contract is attached to this benefit.");
      return;
    }
    if (card.requiresContract && !acceptedContract) {
      setErrorMessage("Please confirm the contract agreement before requesting.");
      return;
    }
    setErrorMessage(null);
    try {
      await submitEmployeeBenefitRequest({
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: EmployeeDashboardDataDocument,
            variables: { employeeId },
          },
          {
            query: EmployeeBenefitRequestsDocument,
            variables: { employeeId },
          },
        ],
        variables: {
          input: {
            benefitId: card.id,
            contractAcceptedAt: contract ? new Date().toISOString() : undefined,
            contractVersionAccepted: contract?.version,
            employeeId,
            requestedBy: currentUserIdentifier,
          },
        },
      });
      await onSubmitted();
      onClose();
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error
          ? requestError.message
          : "Benefit request could not be submitted.",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex min-h-full items-center justify-center">
        <div className="relative w-full max-w-[512px] rounded-[12px] border border-[#CBD5E1] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)] sm:w-[512px]">
        <button
          className="absolute top-1 right-1 rounded-[8px] p-2 text-[#737373]"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-start px-8 py-7">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-[20px] leading-7 font-semibold text-[#0A0A0A]">{card.title}</h2>
              <span className={["inline-flex items-center gap-[6px] rounded-[8px] px-3 py-2 text-[12px] font-medium leading-4", getBadgeClass(card.status)].join(" ")}>
                <StatusBadgeIcon status={card.status} />
                {card.status}
              </span>
            </div>
            <p className="text-[14px] leading-5 text-[#737373]">{card.description}</p>
          </div>
        </div>
        <div className="flex flex-col gap-6 border-t border-[#E5E7EB] px-8 py-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[14px] leading-5 text-[#737373]">Subsidy</p>
              <p className="mt-1 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                {card.subsidyPercent !== null ? `${card.subsidyPercent}%` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[14px] leading-5 text-[#737373]">Vendor</p>
              <p className="mt-1 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                {card.vendorName ?? "N/A"}
              </p>
            </div>
          </div>

          {card.requiresContract ? (
            <EmployeeBenefitDialogContractSection
              acceptedContract={acceptedContract}
              contract={contract}
              contractLoading={contractLoading}
              onAcceptedContractChange={setAcceptedContract}
              onViewContract={() => void handleViewContract()}
            />
          ) : null}
          <EmployeeBenefitDialogEligibilitySection
            items={eligibilityItems}
            loading={loading}
          />
          {errorMessage || error ? (
            <p className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] leading-5 text-[#B91C1C]">
              {errorMessage ?? error?.message}
            </p>
          ) : null}
          <div className="flex justify-end">
            <button
              className="inline-flex h-10 items-center justify-center rounded-[8px] bg-black px-5 text-[14px] leading-5 font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:bg-[#A3A3A3]"
              disabled={isSubmitDisabled}
              onClick={() => void handleSubmit()}
              type="button"
            >
              {submitting ? "Submitting..." : "Request Benefit"}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
