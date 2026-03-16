"use client";

import { useLazyQuery } from "@apollo/client/react";
import { Eye, FileText, RefreshCw } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

import BenefitDialogToggle from "./BenefitDialogToggle";
import {
  CONTRACT_SIGNED_URL_BY_BENEFIT_QUERY,
  type ContractSignedUrlByBenefitQuery,
  type ContractSignedUrlByBenefitVariables,
} from "./edit-benefit-dialog.graphql";

type EditBenefitContractPanelProps = {
  benefitId: string;
  checked: boolean;
  contractFile: File | null;
  onContractFileChange: (file: File | null) => void;
  onCheckedChange: (checked: boolean) => void;
};

const ACCEPTED_CONTRACT_TYPES = ".pdf,.doc,.docx";

function isAcceptedContractFile(fileName: string) {
  const lowered = fileName.toLowerCase();
  return lowered.endsWith(".pdf") || lowered.endsWith(".doc") || lowered.endsWith(".docx");
}

export default function EditBenefitContractPanel({
  benefitId,
  checked,
  contractFile,
  onContractFileChange,
  onCheckedChange,
}: EditBenefitContractPanelProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fetchSignedUrl, { loading }] = useLazyQuery<
    ContractSignedUrlByBenefitQuery,
    ContractSignedUrlByBenefitVariables
  >(CONTRACT_SIGNED_URL_BY_BENEFIT_QUERY, {
    fetchPolicy: "network-only",
  });

  function openFilePicker() {
    if (!checked) {
      return;
    }

    inputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!isAcceptedContractFile(file.name)) {
      setErrorMessage("Only PDF, DOC, or DOCX files are allowed.");
      event.target.value = "";
      return;
    }

    setErrorMessage(null);
    onContractFileChange(file);
  }

  async function handleViewContract() {
    if (!checked) {
      return;
    }

    if (contractFile) {
      const fileUrl = URL.createObjectURL(contractFile);
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
      return;
    }

    setErrorMessage(null);

    try {
      const { data } = await fetchSignedUrl({ variables: { benefitId } });
      const signedUrl = data?.contractSignedUrlByBenefit.signedUrl;

      if (!signedUrl) {
        setErrorMessage("No active contract found for this benefit.");
        return;
      }

      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
      const resolvedUrl = /^https?:\/\//i.test(signedUrl)
        ? signedUrl
        : endpoint
          ? new URL(signedUrl, new URL(endpoint).origin).toString()
          : new URL(signedUrl, window.location.origin).toString();

      window.open(resolvedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load contract.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-[2px]">
          <span className="text-[14px] leading-4 font-medium text-black">Requires Contract</span>
          <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
            Employee must sign an agreement
          </span>
        </div>
        <BenefitDialogToggle checked={checked} onCheckedChange={onCheckedChange} />
      </div>

      <div className="flex w-full flex-col gap-2 rounded-[10px] border border-[#CBD5E1] bg-[rgba(245,245,245,0.3)] p-4">
        <input
          accept={ACCEPTED_CONTRACT_TYPES}
          className="hidden"
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
        />

        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#E5E5E5] bg-white">
              <FileText className="h-6 w-6 text-[#737373]" />
            </div>
            <span className="truncate text-[14px] leading-5 font-medium text-[#0A0A0A]">
              {contractFile ? contractFile.name : "Benefit contract"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex h-8 items-center justify-center gap-1 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#A3A3A3]"
              disabled={!checked || loading}
              onClick={handleViewContract}
              type="button"
            >
              <Eye className="h-4 w-4" />
              {loading ? "Loading..." : "View"}
            </button>
            <button
              className="flex h-8 items-center justify-center gap-1 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#A3A3A3]"
              disabled={!checked}
              onClick={openFilePicker}
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
              Replace
            </button>
          </div>
        </div>

        {errorMessage ? (
          <p className="rounded-[6px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[12px] leading-4 text-[#B42318]">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
