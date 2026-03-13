"use client";
/* eslint-disable max-lines */

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { ChevronDown, Percent, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import BenefitDialogFieldLabel from "./BenefitDialogFieldLabel";
import BenefitDialogToggle from "./BenefitDialogToggle";
import EditBenefitContractPanel from "./EditBenefitContractPanel";
import EditBenefitEligibilityRuleCard from "./EditBenefitEligibilityRuleCard";

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

type UpdatedBenefitPayload = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: string;
  subsidyPercent?: number | null;
  vendorName?: string | null;
};

type DeleteBenefitMutation = {
  deleteBenefit: boolean;
};

type DeleteBenefitVariables = {
  id: string;
};

type BenefitCategoriesQuery = {
  benefitCategories?: Array<{
    id: string;
    name: string;
  } | null> | null;
};

type UpdateBenefitMutation = {
  updateBenefit: UpdatedBenefitPayload;
};

type UpdateBenefitVariables = {
  input: {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    subsidyPercent: number;
    vendorName?: string | null;
  };
};

const DELETE_BENEFIT_MUTATION = gql`
  mutation DeleteBenefit($id: ID!) {
    deleteBenefit(id: $id)
  }
`;

const BENEFIT_CATEGORIES_QUERY = gql`
  query BenefitCategoriesForEdit {
    benefitCategories {
      id
      name
    }
  }
`;

const UPDATE_BENEFIT_MUTATION = gql`
  mutation UpdateBenefit($input: UpdateBenefitInput!) {
    updateBenefit(input: $input) {
      id
      title
      description
      category
      categoryId
      subsidyPercent
      vendorName
    }
  }
`;

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
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);
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
  const { data: categoryData, loading: categoriesLoading } =
    useQuery<BenefitCategoriesQuery>(BENEFIT_CATEGORIES_QUERY);

  const categories = (categoryData?.benefitCategories ?? []).flatMap((item) =>
    item ? [item] : [],
  );

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

    if (!selectedCategoryId) {
      setErrorMessage("Please choose a category.");
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
            categoryId: selectedCategoryId,
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

  const selectedCategoryName =
    categories.find((item) => item.id === selectedCategoryId)?.name ?? category;

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
              <span>{selectedCategoryName}</span>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-8 px-[2px] py-[2px]">
            <div className="flex items-center justify-between gap-4">
              <BenefitDialogFieldLabel>Benefit Name</BenefitDialogFieldLabel>
              <input
                className="h-9 w-[300px] rounded-[6px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-5 text-[#0F172A] outline-none"
                onChange={(event) => setName(event.target.value)}
                type="text"
                value={name}
              />
            </div>

            <label className="flex flex-col gap-2">
              <BenefitDialogFieldLabel>Description</BenefitDialogFieldLabel>
              <textarea
                className="min-h-24 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none"
                onChange={(event) => setBenefitDescription(event.target.value)}
                value={benefitDescription}
              />
            </label>
            <div className="border-t border-[#DBDEE1]" />

            <div className="flex flex-col gap-5">
              <h3 className="text-[16px] leading-4 font-semibold text-black">
                Benefit Value
              </h3>
              <div className="grid grid-cols-3 gap-[10px]">
                <label className="flex flex-col gap-[10px]">
                  <BenefitDialogFieldLabel>Category</BenefitDialogFieldLabel>
                  <div className="flex h-[33px] items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-[18px]">
                    <select
                      aria-label="Benefit category"
                      className="w-full bg-transparent text-[12px] leading-4 outline-none"
                      disabled={categoriesLoading}
                      onChange={(event) => setSelectedCategoryId(event.target.value)}
                      value={selectedCategoryId}
                    >
                      {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="h-6 w-6 text-black" />
                  </div>
                </label>

                <label className="flex flex-col gap-[10px]">
                  <BenefitDialogFieldLabel>Subsidy Percent</BenefitDialogFieldLabel>
                  <div className="flex h-[33px] items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-[18px]">
                    <input
                      className="w-full text-[12px] leading-4 outline-none"
                      max={100}
                      min={0}
                      onChange={(event) => setSubsidyPercentValue(event.target.value)}
                      type="number"
                      value={subsidyPercentValue}
                    />
                    <Percent className="h-4 w-4 text-black" />
                  </div>
                </label>

                <label className="flex flex-col gap-[10px]">
                  <BenefitDialogFieldLabel>Vendor name</BenefitDialogFieldLabel>
                  <input
                    className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 outline-none"
                    onChange={(event) => setVendorNameValue(event.target.value)}
                    type="text"
                    value={vendorNameValue}
                  />
                </label>
              </div>
            </div>

            <div className="border-t border-[#DBDEE1]" />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-[5px]">
                <h3 className="text-[16px] leading-4 font-semibold text-black">
                  Eligibility Rules
                </h3>
                <p className="text-[12px] leading-4 font-normal text-[#5B6470]">
                  All rules must pass for employees to become eligible.
                </p>
              </div>
              <EditBenefitEligibilityRuleCard
                explanation="You must be an active employee to access this benefit."
                operator="is"
                ruleType="Employment Status"
                value="Active"
              />
              <EditBenefitEligibilityRuleCard
                explanation="Please submit your OKRs to unlock this benefit."
                operator="is"
                ruleType="OKR Submitted"
                value="True"
              />
              <EditBenefitEligibilityRuleCard
                explanation="You must have fewer than 3 late arrivals this quarter."
                operator="less than"
                ruleType="Late Arrivals"
                value="3"
              />
              <button
                className="flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#CBD5E1] bg-white text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                type="button"
              >
                <Plus className="h-4 w-4" />
                Add Another Rule
              </button>
            </div>

            <div className="border-t border-[#DBDEE1]" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[5px]">
                <span className="text-[14px] leading-4 font-medium text-black">
                  Core Benefit
                </span>
                <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
                  Available to all employees
                </span>
              </div>
              <BenefitDialogToggle />
            </div>

            <EditBenefitContractPanel />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex shrink-0 flex-col gap-3 border-t border-[#DBDEE1] bg-white px-6 pt-4 pb-6">
          {errorMessage ? (
            <p className="w-full rounded-[6px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
              {errorMessage}
            </p>
          ) : null}
          <div className="flex items-center justify-between gap-[9px]">
            <button
              className="flex h-[38px] items-center justify-center gap-[10px] rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:bg-[#FCA5A5]"
              disabled={deleting || updating}
              onClick={handleDelete}
              type="button"
            >
              <Trash2 className="h-[18px] w-[18px]" />
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <div className="flex items-center gap-[9px]">
              <button
                className="flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[10px] text-[14px] leading-4 font-normal text-black"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <button
                className="flex h-9 items-center justify-center rounded-[6px] bg-black px-[10px] text-[14px] leading-4 font-normal text-white disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
                disabled={updating || deleting || categoriesLoading}
                onClick={handleSave}
                type="button"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
