"use client";

import { useContractSignedUrlByBenefitLazyQuery } from "@/shared/apollo/generated";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import ContractDialogFooter from "./ContractDialogFooter";
import ContractDialogShell from "./ContractDialogShell";
import {
  ContractEditFields,
  ContractFileSection,
  ContractHistorySection,
  ContractOverviewSection,
} from "./ContractViewSections";
import {
  buildContractFileName,
  deriveNextVersion,
  resolveSignedContractUrl,
  toEditableDate,
  type ContractViewContract,
} from "./contract-view-utils";
import { normalizeDateInput } from "./contract-dialog-utils";
import { useCloseOnEscape } from "./useCloseOnEscape";
import { useContractVersionHistory } from "./useContractVersionHistory";

type ContractViewDialogProps = {
  contract: ContractViewContract;
  onClose: () => void;
  onSaveNewVersion: (input: {
    benefitId: string;
    effectiveDate: string;
    expiryDate: string;
    file: File;
    notes: string;
    vendorName: string;
    version: string;
  }) => Promise<void>;
  savingNewVersion?: boolean;
};

const ACCEPTED_CONTRACT_TYPES = ".pdf,.doc,.docx";

export default function ContractViewDialog({
  contract,
  onClose,
  onSaveNewVersion,
  savingNewVersion = false,
}: ContractViewDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const effectiveDatePickerRef = useRef<HTMLInputElement | null>(null);
  const expiryDatePickerRef = useRef<HTMLInputElement | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [draftEffectiveDate, setDraftEffectiveDate] = useState(toEditableDate(contract.effectiveDate));
  const [draftExpiryDate, setDraftExpiryDate] = useState(toEditableDate(contract.expiryDate));
  const [draftNotes, setDraftNotes] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [fetchSignedUrl, { loading: downloading }] = useContractSignedUrlByBenefitLazyQuery({
    fetchPolicy: "network-only",
  });
  const { historyError, historyRows } = useContractVersionHistory(contract);
  useCloseOnEscape(onClose);
  const fileName = useMemo(
    () => selectedFile?.name ?? buildContractFileName(contract.vendor || contract.benefit, contract.version),
    [contract.benefit, contract.vendor, contract.version, selectedFile?.name],
  );
  const uploadSummary = selectedFile ? "New contract file selected for this version." : `Uploaded for ${contract.version} and active since ${contract.effectiveDate}.`;

  function openFilePicker() {
    setEditMode(true);
    fileInputRef.current?.click();
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] ?? null);
    setActionError(null);
  }

  function handleDatePickerValue(value: string, kind: "effective" | "expiry") {
    if (!value) return;
    const formatted = value.replace(/-/g, ".");
    return kind === "effective" ? setDraftEffectiveDate(formatted) : setDraftExpiryDate(formatted);
  }

  async function handleDownload() {
    if (selectedFile) {
      const blobUrl = URL.createObjectURL(selectedFile);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = selectedFile.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      return;
    }

    setActionError(null);
    try {
      const { data } = await fetchSignedUrl({ variables: { benefitId: contract.benefitId } });
      const signedUrl = data?.contractSignedUrlByBenefit.signedUrl;
      if (!signedUrl) return setActionError("No active contract file found for this benefit.");
      window.open(resolveSignedContractUrl(signedUrl), "_blank", "noopener,noreferrer");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to download contract.");
    }
  }

  async function handleSaveNewVersion() {
    if (!selectedFile) return setActionError("Select a new contract file before saving.");
    if (!draftEffectiveDate || !draftExpiryDate) return setActionError("Enter both effective and expiry dates.");

    try {
      setActionError(null);
      await onSaveNewVersion({
        benefitId: contract.benefitId,
        effectiveDate: draftEffectiveDate,
        expiryDate: draftExpiryDate,
        file: selectedFile,
        notes: draftNotes,
        vendorName: contract.vendor,
        version: deriveNextVersion(contract.version),
      });
      setEditMode(false);
      setDraftNotes("");
      setSelectedFile(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to save new version.");
    }
  }

  return (
    <ContractDialogShell onClose={onClose} subtitle="Contract Details" title={contract.benefit} zIndexClass="z-[70]">
      <div className="flex max-h-[651px] w-full flex-col gap-5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ContractOverviewSection contract={contract} editMode={editMode} />
        <ContractFileSection
          actionError={actionError}
          downloading={downloading}
          editMode={editMode}
          fileName={fileName}
          onDownload={() => void handleDownload()}
          onOpenFilePicker={openFilePicker}
          uploadSummary={uploadSummary}
        />
        <input accept={ACCEPTED_CONTRACT_TYPES} className="hidden" onChange={handleFileSelected} ref={fileInputRef} type="file" />
        {editMode ? (
          <ContractEditFields
            actionError={actionError}
            draftEffectiveDate={draftEffectiveDate}
            draftExpiryDate={draftExpiryDate}
            draftNotes={draftNotes}
            effectiveDatePickerRef={effectiveDatePickerRef}
            expiryDatePickerRef={expiryDatePickerRef}
            onDraftEffectiveDateChange={(value) => setDraftEffectiveDate(normalizeDateInput(value))}
            onDraftExpiryDateChange={(value) => setDraftExpiryDate(normalizeDateInput(value))}
            onDraftNotesChange={setDraftNotes}
            onPickerValueChange={handleDatePickerValue}
          />
        ) : null}
        <ContractHistorySection
          acceptedCount={contract.acceptedCount}
          errorMessage={historyError ? "Failed to load full version history." : null}
          rows={historyRows}
        />
      </div>
      <div className={editMode ? "" : "[&_button:last-child]:bg-[#737373]"}>
        <ContractDialogFooter
          onPrimary={editMode ? () => void handleSaveNewVersion() : openFilePicker}
          onSecondary={onClose}
          primaryDisabled={editMode && savingNewVersion}
          primaryLabel={editMode && savingNewVersion ? "Saving..." : "Save New Version"}
          secondaryLabel="Close"
        />
      </div>
    </ContractDialogShell>
  );
}
