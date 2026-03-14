"use client";
/* eslint-disable max-lines */

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { ChevronDown, Percent, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import BenefitDialogFieldLabel from "./BenefitDialogFieldLabel";
import BenefitDialogToggle from "./BenefitDialogToggle";

export type BenefitDraft = {
  categoryId: string;
  coreBenefitEnabled: boolean;
  description: string;
  name: string;
  requiresContract: boolean;
  subsidyPercent: number;
  vendorName: string;
};

type AddBenefitDialogProps = {
  defaultCategoryId?: string | null;
  initialDraft?: BenefitDraft | null;
  onClose: () => void;
  onCreated?: () => void | Promise<unknown>;
  onDraftChange?: (draft: BenefitDraft | null) => void;
};

type CreateBenefitMutation = {
  createBenefit: {
    id: string;
    title: string;
  };
};

type CreateBenefitVariables = {
  input: {
    categoryId: string;
    description: string;
    name: string;
    requiresContract?: boolean;
    subsidyPercent: number;
    vendorName?: string | null;
  };
};

const CREATE_BENEFIT_MUTATION = gql`
  mutation CreateBenefit($input: CreateBenefitInput!) {
    createBenefit(input: $input) {
      id
      title
    }
  }
`;

export default function AddBenefitDialog({
  defaultCategoryId,
  initialDraft,
  onClose,
  onCreated,
  onDraftChange,
}: AddBenefitDialogProps) {
  const [name, setName] = useState(initialDraft?.name ?? "");
  const [description, setDescription] = useState(initialDraft?.description ?? "");
  const [categoryId] = useState(
    initialDraft?.categoryId ?? defaultCategoryId ?? "",
  );
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

  function buildDraft(): BenefitDraft {
    const parsedSubsidy = Number.parseInt(subsidyPercent, 10);

    return {
      name,
      description,
      categoryId,
      subsidyPercent: Number.isInteger(parsedSubsidy) ? parsedSubsidy : 50,
      vendorName,
      coreBenefitEnabled,
      requiresContract,
    };
  }

  function hasDraftContent(draft: BenefitDraft) {
    return (
      draft.name.trim().length > 0 ||
      draft.description.trim().length > 0 ||
      draft.vendorName.trim().length > 0 ||
      draft.coreBenefitEnabled ||
      draft.requiresContract ||
      draft.subsidyPercent !== 50 ||
      draft.categoryId !== ""
    );
  }

  function handleCloseWithDraft() {
    const draft = buildDraft();

    if (hasDraftContent(draft)) {
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

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-full flex-col items-start gap-8">
            <div className="flex w-full items-center justify-between gap-4">
              <BenefitDialogFieldLabel>Benefit Name</BenefitDialogFieldLabel>
              <input
                className="h-9 w-[300px] rounded-[6px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-5 text-[#0F172A] outline-none"
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                type="text"
                value={name}
              />
            </div>

            <label className="flex w-full flex-col items-start gap-2">
              <BenefitDialogFieldLabel>Description</BenefitDialogFieldLabel>
              <textarea
                className="min-h-24 w-full rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Explain how this benefit works and what employees get from it..."
                value={description}
              />
            </label>

            <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
              <label className="flex flex-1 flex-col gap-[10px]">
                <BenefitDialogFieldLabel>Subsidy Percent</BenefitDialogFieldLabel>
                <div className="flex h-[33px] items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-[18px]">
                  <input
                    className="w-full text-[12px] leading-4 font-normal text-black outline-none"
                    max={100}
                    min={0}
                    onChange={(event) => setSubsidyPercent(event.target.value)}
                    type="number"
                    value={subsidyPercent}
                  />
                  <Percent className="h-4 w-4 text-black" />
                </div>
              </label>

              <label className="flex flex-1 flex-col gap-[10px]">
                <BenefitDialogFieldLabel>Vendor name</BenefitDialogFieldLabel>
                <input
                  className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 font-normal text-black outline-none"
                  onChange={(event) => setVendorName(event.target.value)}
                  placeholder="Vendor"
                  type="text"
                  value={vendorName}
                />
              </label>
            </div>

            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col items-start gap-[5px]">
                <span className="text-[14px] leading-4 font-medium text-black">Core Benefit</span>
                <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
                  Available to all employees
                </span>
              </div>
              <BenefitDialogToggle
                checked={coreBenefitEnabled}
                onCheckedChange={setCoreBenefitEnabled}
              />
            </div>

            <div className="flex w-full flex-col items-start gap-3">
              <div className="flex w-full flex-col gap-4 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-4">
                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                  <button
                    className="flex h-9 w-full items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] lg:w-[180px]"
                    type="button"
                  >
                    <span className="text-[14px] leading-5 font-normal text-[#737373]">Rule Type</span>
                    <ChevronDown className="h-4 w-4 text-[#737373]" />
                  </button>
                  <button
                    className="flex h-9 w-full items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] lg:flex-1"
                    type="button"
                  >
                    <span className="text-[14px] leading-5 font-normal text-[#0A0A0A]">at least</span>
                    <ChevronDown className="h-4 w-4 text-[#737373]" />
                  </button>
                  <input
                    className="h-9 w-full rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373] lg:flex-1"
                    placeholder="Enter value"
                    type="text"
                  />
                  <button className="flex h-8 w-8 items-center justify-center rounded-[8px] opacity-50" type="button">
                    <Trash2 className="h-4 w-4 text-[#737373]" />
                  </button>
                </div>
              </div>

              <button
                className="flex h-9 w-full items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                type="button"
              >
                <Plus className="h-4 w-4" />
                Add Another Rule
              </button>
            </div>

            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col items-start gap-[2px]">
                  <span className="text-[14px] leading-4 font-medium text-black">Requires Contract</span>
                  <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
                    Employee must sign an agreement
                  </span>
                </div>
                <BenefitDialogToggle
                  checked={requiresContract}
                  onCheckedChange={setRequiresContract}
                />
              </div>

              <button
                className="flex h-9 w-full items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] leading-5 font-medium text-[#BFBFBF] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                type="button"
              >
                <Upload className="h-4 w-4" />
                Upload Contract
              </button>
            </div>

            {errorMessage ? (
              <p
                className="mb-4 w-full scroll-mb-8 rounded-[6px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]"
                ref={errorMessageRef}
              >
                {errorMessage}
              </p>
            ) : null}
          </div>
        </div>

        <div className="sticky bottom-0 z-10 shrink-0 border-t border-[#E6EBF0] bg-white px-6 py-4">
          <div className="flex w-full justify-end">
            <div className="flex items-center gap-[9px]">
              <button
                className="flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[10px] text-[14px] leading-4 font-normal text-black"
                onClick={handleCloseWithDraft}
                type="button"
              >
                Cancel
              </button>
              <button
                className="flex h-9 items-center justify-center rounded-[6px] bg-black px-[10px] text-[14px] leading-4 font-normal text-white disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
                disabled={saving}
                onClick={handleSave}
                type="button"
              >
                {saving ? "Saving..." : "Add Benefit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
