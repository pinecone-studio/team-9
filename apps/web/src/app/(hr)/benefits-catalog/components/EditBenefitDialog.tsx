"use client";

import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import EditBenefitDialogFooter from "./EditBenefitDialogFooter";
import EditBenefitDialogForm from "./EditBenefitDialogForm";
import {
  DELETE_BENEFIT_MUTATION,
  UPDATE_BENEFIT_MUTATION,
  type DeleteBenefitMutation,
  type DeleteBenefitVariables,
  type UpdateBenefitMutation,
  type UpdateBenefitVariables,
  type UpdatedBenefitPayload,
} from "./edit-benefit-dialog.graphql";

type EditBenefitDialogProps = {
  benefitId: string;
  benefitName: string;
  category: string;
  categoryId: string;
  description: string;
  subsidyPercent: number;
  vendorName: string;
  onDeleted?: (benefitId: string) => void | Promise<unknown>;
  onUpdated?: (benefit: UpdatedBenefitPayload) => void | Promise<unknown>;
  onClose: () => void;
};

export default function EditBenefitDialog({
  benefitId,
  benefitName,
  category,
  categoryId,
  description,
  subsidyPercent,
  vendorName,
  onDeleted,
  onUpdated,
  onClose,
}: EditBenefitDialogProps) {
  const [name, setName] = useState(benefitName);
  const [benefitDescription, setBenefitDescription] = useState(description);
  const [subsidyPercentValue, setSubsidyPercentValue] = useState(
    String(subsidyPercent),
  );
  const [vendorNameValue, setVendorNameValue] = useState(vendorName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteBenefit, { loading: deleting }] = useMutation<
    DeleteBenefitMutation,
    DeleteBenefitVariables
  >(DELETE_BENEFIT_MUTATION);
  const [updateBenefit, { loading: updating }] = useMutation<
    UpdateBenefitMutation,
    UpdateBenefitVariables
  >(UPDATE_BENEFIT_MUTATION);

  async function handleDelete() {
    setErrorMessage(null);

    try {
      const result = await deleteBenefit({
        variables: { id: benefitId },
      });

      if (!result.data?.deleteBenefit) {
        setErrorMessage("Benefit not found or already deleted.");
        return;
      }

      await onDeleted?.(benefitId);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Benefit could not be deleted.",
      );
    }
  }

  async function handleSave() {
    const trimmedName = name.trim();
    const trimmedDescription = benefitDescription.trim();
    const trimmedVendorName = vendorNameValue.trim();
    const parsedSubsidy = Number.parseInt(subsidyPercentValue, 10);

    if (!trimmedName) {
      setErrorMessage("Benefit name is required.");
      return;
    }

    if (!trimmedDescription) {
      setErrorMessage("Description is required.");
      return;
    }

    if (!Number.isInteger(parsedSubsidy) || parsedSubsidy < 0 || parsedSubsidy > 100) {
      setErrorMessage("Subsidy percent must be a whole number between 0 and 100.");
      return;
    }

    setErrorMessage(null);

    try {
      const result = await updateBenefit({
        variables: {
          input: {
            id: benefitId,
            name: trimmedName,
            description: trimmedDescription,
            categoryId,
            subsidyPercent: parsedSubsidy,
            vendorName: trimmedVendorName || null,
          },
        },
      });

      if (result.data?.updateBenefit) {
        await onUpdated?.(result.data.updateBenefit);
      }

      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Benefit could not be updated.",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex h-full max-h-[calc(100vh-48px)] w-full max-w-[626px] flex-col overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-white">
        <div className="sticky top-0 z-10 shrink-0 bg-white px-6 pt-6 pb-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">
              Edit Benefit
            </h2>
            <div className="flex items-center gap-2 text-[14px] leading-5 font-normal text-[#64748B]">
              <span>{category}</span>
              <span>-</span>
              <span>{benefitName}</span>
            </div>
          </div>
        </div>

        <EditBenefitDialogForm
          benefitDescription={benefitDescription}
          name={name}
          onBenefitDescriptionChange={setBenefitDescription}
          onNameChange={setName}
          onSubsidyPercentChange={setSubsidyPercentValue}
          onVendorNameChange={setVendorNameValue}
          subsidyPercentValue={subsidyPercentValue}
          vendorNameValue={vendorNameValue}
        />

        <EditBenefitDialogFooter
          deleting={deleting}
          errorMessage={errorMessage}
          onCancel={onClose}
          onDelete={handleDelete}
          onSave={handleSave}
          updating={updating}
        />
      </div>
    </div>
  );
}
