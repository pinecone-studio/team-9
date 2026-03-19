"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FileClock, FileText, Users } from "lucide-react";
import AcceptedEmployeesDialog from "./AcceptedEmployeesDialog";
import ContractViewDialog from "./ContractViewDialog";
import ContractsHero from "./ContractsHero";
import ContractsSearch from "./ContractsSearch";
import ContractsSuccessToast from "./ContractsSuccessToast";
import ContractsTable, { ContractsTableSkeleton } from "./ContractsTable";
import RenewContractDialog from "./RenewContractDialog";
import UploadContractDialog from "./UploadContractDialog";
import type { ContractKpiCard, ContractRow } from "./contracts-types";
import { useContractMutations } from "./useContractMutations";
import { useContractsData } from "./useContractsData";

export default function ContractsContent() {
  const [searchText, setSearchText] = useState("");
  const [selectedContract, setSelectedContract] = useState<ContractRow | null>(null);
  const [acceptedEmployeesTarget, setAcceptedEmployeesTarget] =
    useState<ContractRow | null>(null);
  const [renewContractTarget, setRenewContractTarget] = useState<ContractRow | null>(null);
  const [uploadContractTarget, setUploadContractTarget] = useState<{
    benefitId?: string;
    vendorName?: string;
  } | null>(null);
  const {
    acceptedCountByBenefitId,
    allBenefits,
    benefitOptions,
    contractRows,
    contractsLoading,
    filteredRows,
    isInitialContractsLoading,
    loading,
    setContractsByBenefitId,
  } = useContractsData(searchText);
  const {
    creatingContract,
    handleCreateContract,
    handleRenewContract,
    handleSaveNewVersion,
    renewingContract,
    savingNewVersion,
    successMessage,
  } = useContractMutations({
    acceptedCountByBenefitId,
    allBenefits,
    setContractsByBenefitId,
    setRenewContractTarget,
    setSelectedContract,
  });

  const kpiCards: ContractKpiCard[] = useMemo(
    () => [
      {
        icon: CheckCircle2,
        label: "Active Contracts",
        value: contractRows.filter((row) => row.status === "active").length,
      },
      {
        icon: FileClock,
        label: "Expiring Soon",
        value: contractRows.filter((row) => row.status === "expiring").length,
      },
      {
        icon: FileText,
        label: "Archived Versions",
        value: contractRows.filter((row) => row.status === "archived").length,
      },
      {
        icon: Users,
        label: "Acceptances This Month",
        value: 0,
      },
    ],
    [contractRows],
  );

  return (
    <section className="flex w-full max-w-[1280px] flex-col items-start gap-5 py-6">
      <ContractsHero cards={kpiCards} loading={isInitialContractsLoading} />

      {isInitialContractsLoading ? (
        <>
          <ContractsSearch loading onChange={setSearchText} value={searchText} />
          <ContractsTableSkeleton />
        </>
      ) : (
        <>
          <ContractsSearch loading={false} onChange={setSearchText} value={searchText} />
          <ContractsTable
            contractsLoading={contractsLoading}
            loading={loading}
            onAcceptedClick={setAcceptedEmployeesTarget}
            onRenew={setRenewContractTarget}
            onUpload={(row) =>
              setUploadContractTarget({
                benefitId: row.benefitId,
                vendorName: row.vendor,
              })
            }
            onView={setSelectedContract}
            rows={filteredRows}
          />
        </>
      )}

      {acceptedEmployeesTarget ? (
        <AcceptedEmployeesDialog
          contract={acceptedEmployeesTarget}
          key={`${acceptedEmployeesTarget.benefitId}-${acceptedEmployeesTarget.version}`}
          onClose={() => setAcceptedEmployeesTarget(null)}
        />
      ) : null}

      {selectedContract ? (
        <ContractViewDialog
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
          onSaveNewVersion={({ benefitId, effectiveDate, expiryDate, file, vendorName, version }) =>
            handleSaveNewVersion({
              benefitId,
              effectiveDate,
              expiryDate,
              file,
              vendorName,
              version,
            })
          }
          savingNewVersion={savingNewVersion}
        />
      ) : null}

      {renewContractTarget ? (
        <RenewContractDialog
          contract={renewContractTarget}
          onClose={() => setRenewContractTarget(null)}
          onRenew={({ effectiveDate, expiryDate, file, vendorName, version }) =>
            handleRenewContract({
              benefitId: renewContractTarget.benefitId,
              effectiveDate,
              expiryDate,
              file,
              vendorName,
              version,
            })
          }
          renewing={renewingContract}
        />
      ) : null}

      {uploadContractTarget ? (
        <UploadContractDialog
          benefitOptions={benefitOptions}
          initialBenefitId={uploadContractTarget.benefitId}
          initialVendorName={uploadContractTarget.vendorName}
          creating={creatingContract}
          onClose={() => setUploadContractTarget(null)}
          onCreate={({ benefitId, effectiveDate, expiryDate, file, vendorName, version }) =>
            handleCreateContract({
              benefitId,
              effectiveDate,
              expiryDate,
              file,
              vendorName,
              version,
            })
          }
        />
      ) : null}

      <ContractsSuccessToast message={successMessage} />
    </section>
  );
}
