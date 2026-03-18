import { gql } from "@apollo/client";

import type { BackendContract } from "./contracts-content.helpers";

export type BenefitContractForContractsQuery = {
  benefitContract: BackendContract | null;
};

export const BenefitContractForContractsDocument = gql`
  query BenefitContractForContracts($benefitId: ID!) {
    benefitContract(benefitId: $benefitId) {
      id
      benefitId
      vendorName
      version
      effectiveDate
      expiryDate
      isActive
    }
  }
`;
