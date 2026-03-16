"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BenefitCardItem } from "./BenefitCardItem";
import { BenefitSectionHeader } from "./BenefitSectionHeader";
import {
  buildEmployeeBenefitRequestPayload,
  buildEmployeeBenefitRequestSnapshot,
} from "./benefits-request-payload";
import {
  CREATE_APPROVAL_REQUEST_MUTATION,
  type CreateApprovalRequestMutation,
  type CreateApprovalRequestVariables,
} from "./employee-requests.graphql";
import type { EmployeeBenefitCard, EmployeeBenefitSection } from "./employee-types";

type BenefitsGroupProps = {
  currentUserIdentifier: string;
  employeeEmail: string | null;
  employeeId: string;
  employeeName: string;
  section: EmployeeBenefitSection;
};

export function BenefitsGroup({
  currentUserIdentifier,
  employeeEmail,
  employeeId,
  employeeName,
  section,
}: BenefitsGroupProps) {
  const router = useRouter();
  const { items, title } = section;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittingBenefitId, setSubmittingBenefitId] = useState<string | null>(
    null,
  );
  const [createApprovalRequest] = useMutation<
    CreateApprovalRequestMutation,
    CreateApprovalRequestVariables
  >(CREATE_APPROVAL_REQUEST_MUTATION);

  async function handleRequest(card: EmployeeBenefitCard) {
    setErrorMessage(null);
    setSubmittingBenefitId(card.id);

    try {
      await createApprovalRequest({
        variables: {
          input: {
            actionType: "update",
            entityId: card.id,
            entityType: "benefit",
            payloadJson: buildEmployeeBenefitRequestPayload({
              card,
              employeeEmail,
              employeeId,
              employeeName,
            }),
            requestedBy: currentUserIdentifier,
            snapshotJson: buildEmployeeBenefitRequestSnapshot({
              card,
              employeeEmail,
              employeeId,
            }),
            targetRole: card.approvalRole,
          },
        },
      });
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Request could not be submitted.",
      );
    } finally {
      setSubmittingBenefitId(null);
    }
  }

  return (
    <>
      <BenefitSectionHeader itemCount={items.length} title={title} />
      {errorMessage ? (
        <div className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[13px] leading-5 text-[#B91C1C]">
          {errorMessage}
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((card) => (
          <BenefitCardItem
            card={card}
            isSubmitting={submittingBenefitId === card.id}
            key={card.id}
            onRequest={(selectedCard) => {
              void handleRequest(selectedCard);
            }}
          />
        ))}
      </div>
    </>
  );
}
