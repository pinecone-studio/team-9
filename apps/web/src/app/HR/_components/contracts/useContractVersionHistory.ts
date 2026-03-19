import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import {
  BenefitContractVersionsDocument,
  type BenefitContractVersionsQuery,
} from "./contracts-helpers";
import {
  buildHistoryRows,
  buildHistoryRowsFromContracts,
  type ContractViewContract,
} from "./contract-view-utils";

export function useContractVersionHistory(contract: ContractViewContract) {
  const { data, error } = useQuery<BenefitContractVersionsQuery>(
    BenefitContractVersionsDocument,
    {
      fetchPolicy: "cache-and-network",
      variables: { benefitId: contract.benefitId },
    },
  );

  const historyRows = useMemo(() => {
    const historyContracts = data?.benefitContractVersions ?? [];
    if (historyContracts.length > 0) {
      return buildHistoryRowsFromContracts(historyContracts);
    }

    return buildHistoryRows(contract);
  }, [contract, data?.benefitContractVersions]);

  return {
    historyError: error,
    historyRows,
  };
}
