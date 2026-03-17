"use client";

import { useApolloClient } from "@apollo/client/react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  UploadContractDocument,
  buildContractRow,
  normalizeEditableDate,
  readFileAsDataUrl,
} from "./contracts-helpers";
import type { BackendContract, ContractRow, UploadContractMutation } from "./contracts-types";

type MutationInput = {
  benefitId: string;
  effectiveDate: string;
  expiryDate: string;
  file: File;
  vendorName: string;
  version: string;
};

type BenefitRecord = {
  id: string;
  title: string;
};

type UseContractMutationsProps = {
  acceptedCountByBenefitId: Map<string, number>;
  allBenefits: BenefitRecord[];
  setContractsByBenefitId: Dispatch<SetStateAction<Record<string, BackendContract | null>>>;
  setRenewContractTarget: Dispatch<SetStateAction<ContractRow | null>>;
  setSelectedContract: Dispatch<SetStateAction<ContractRow | null>>;
};

export function useContractMutations({
  acceptedCountByBenefitId,
  allBenefits,
  setContractsByBenefitId,
  setRenewContractTarget,
  setSelectedContract,
}: UseContractMutationsProps) {
  const apolloClient = useApolloClient();
  const [creatingContract, setCreatingContract] = useState(false);
  const [renewingContract, setRenewingContract] = useState(false);
  const [savingNewVersion, setSavingNewVersion] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  async function uploadContractVersion(input: MutationInput) {
    const benefit = allBenefits.find((item) => item.id === input.benefitId);
    if (!benefit) {
      throw new Error("Benefit not found for this contract.");
    }

    const fileBase64 = await readFileAsDataUrl(input.file);
    const result = await apolloClient.mutate<UploadContractMutation>({
      fetchPolicy: "no-cache",
      mutation: UploadContractDocument,
      variables: {
        input: {
          benefitId: input.benefitId,
          effectiveDate: normalizeEditableDate(input.effectiveDate),
          expiryDate: normalizeEditableDate(input.expiryDate),
          fileBase64,
          fileName: input.file.name,
          vendorName: input.vendorName,
          version: input.version,
        },
      },
    });

    const uploadedContract = result.data?.uploadContract;
    if (!uploadedContract) {
      throw new Error("Upload contract mutation did not return a contract.");
    }

    setContractsByBenefitId((current) => ({ ...current, [input.benefitId]: uploadedContract }));
    const nextRow = buildContractRow({
      acceptedCount: acceptedCountByBenefitId.get(input.benefitId) ?? 0,
      benefit: benefit.title,
      benefitId: benefit.id,
      contract: uploadedContract,
    });
    setSelectedContract((current) => (current && current.benefitId === input.benefitId ? nextRow : current));
    setRenewContractTarget((current) => (current && current.benefitId === input.benefitId ? nextRow : current));
    return nextRow;
  }

  async function runMutation(
    input: MutationInput,
    setPending: (value: boolean) => void,
    message: string,
  ) {
    setPending(true);
    try {
      await uploadContractVersion(input);
      setSuccessMessage(message);
    } finally {
      setPending(false);
    }
  }

  return {
    creatingContract,
    handleCreateContract: (input: MutationInput) =>
      runMutation(input, setCreatingContract, "New contract uploaded successfully."),
    handleRenewContract: (input: MutationInput) =>
      runMutation(input, setRenewingContract, "Contract renewed successfully."),
    handleSaveNewVersion: (input: MutationInput) =>
      runMutation(input, setSavingNewVersion, "Contract version saved successfully."),
    renewingContract,
    savingNewVersion,
    successMessage,
  };
}
