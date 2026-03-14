"use client";

import { useMutation } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";

import AddBenefitDialogFooter from "./AddBenefitDialogFooter";
import AddBenefitDialogForm from "./AddBenefitDialogForm";
import {
  CREATE_BENEFIT_MUTATION,
  type CreateBenefitMutation,
  type CreateBenefitVariables,
} from "./add-benefit-dialog.graphql";
import { buildBenefitDraft, hasBenefitDraftContent, type BenefitDraft } from "./benefit-draft";

type AddBenefitDialogProps = {
  defaultCategoryId?: string | null;
  initialDraft?: BenefitDraft | null;
  onClose: () => void;
  onCreated?: () => void | Promise<unknown>;
  onDraftChange?: (draft: BenefitDraft | null) => void;
};

export default function AddBenefitDialog({
  defaultCategoryId,
  initialDraft,
  onClose,
  onCreated,
  onDraftChange,
}: AddBenefitDialogProps) {
  const [name, setName] = useState(initialDraft?.name ?? "");
  const [description, setDescription] = useState(initialDraft?.description ?? "");
  const [categoryId] = useState(initialDraft?.categoryId ?? defaultCategoryId ?? "");
  const [subsidyPercent, setSubsidyPercent] = useState(
    String(initialDraft?.subsidyPercent ?? 50),
  );
  const [vendorName, setVendorName] = useState(initialDraft?.vendorName ?? "");
  const [coreBenefitEnabled, setCoreBenefitEnabled] = useState(
    initialDraft?.coreBenefitEnabled ?? false,
  );
  const [requiresContract, setRequiresContract] = useState(
    initialDraft?.requiresContract ?? false,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorMessageRef = useRef<HTMLParagraphElement | null>(null);
  const [createBenefit, { loading: saving }] = useMutation<
    CreateBenefitMutation,
    CreateBenefitVariables
  >(CREATE_BENEFIT_MUTATION);

  function handleCloseWithDraft() {
    const draft = buildBenefitDraft({
      name,
      description,
      categoryId,
      subsidyPercent,
      vendorName,
      coreBenefitEnabled,
      requiresContract,
    });

    if (hasBenefitDraftContent(draft)) {
      onDraftChange?.(draft);
    } else if (initialDraft) {
      onDraftChange?.(null);
    }

    onClose();
  }

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    errorMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [errorMessage]);

  async function handleSave() {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedVendorName = vendorName.trim();
    const parsedSubsidy = Number.parseInt(subsidyPercent, 10);

    if (!trimmedName) {
      setErrorMessage("Benefit name is required.");
      return;
    }

    if (!categoryId) {
      setErrorMessage("Category is missing. Please add from a category section.");
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
      await createBenefit({
        variables: {
          input: {
            name: trimmedName,
            description: trimmedDescription,
            categoryId,
            subsidyPercent: parsedSubsidy,
            vendorName: trimmedVendorName || null,
            requiresContract,
          },
        },
      });

      onDraftChange?.(null);
      await onCreated?.();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Benefit could not be created.",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleCloseWithDraft();
        }
      }}
    >
      <div className="mx-auto flex h-full max-h-[calc(100vh-48px)] w-full max-w-[626px] flex-col overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-white">
        <div className="sticky top-0 z-10 shrink-0 border-b border-[#E6EBF0] bg-white px-6 pt-6 pb-4">
          <div className="flex w-full flex-col items-start gap-2">
            <h2 className="w-full text-[18px] leading-7 font-semibold text-[#0F172A]">
              Add a New Benefit
            </h2>
            <p className="w-full text-[14px] leading-5 font-normal text-[#64748B]">
              Add a benefit and define the requirements employees must meet to receive it.
            </p>
          </div>
        </div>

        <AddBenefitDialogForm
          coreBenefitEnabled={coreBenefitEnabled}
          description={description}
          errorMessage={errorMessage}
          errorMessageRef={errorMessageRef}
          name={name}
          onCoreBenefitEnabledChange={setCoreBenefitEnabled}
          onDescriptionChange={setDescription}
          onNameChange={setName}
          onRequiresContractChange={setRequiresContract}
          onSubsidyPercentChange={setSubsidyPercent}
          onVendorNameChange={setVendorName}
          requiresContract={requiresContract}
          subsidyPercent={subsidyPercent}
          vendorName={vendorName}
        />

        <AddBenefitDialogFooter
          onCancel={handleCloseWithDraft}
          onSave={handleSave}
          saving={saving}
        />
      </div>
    </div>
  );
}
