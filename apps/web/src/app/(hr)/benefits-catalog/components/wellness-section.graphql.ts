import { gql } from "@apollo/client";

import type { BenefitCatalogRecord } from "../benefit-types";

export type BenefitCatalogQuery = {
  allBenefits?: Array<BenefitCatalogRecord | null> | null;
};

export type SetBenefitStatusMutation = {
  setBenefitStatus: {
    id: string;
    isActive: boolean;
  };
};

export type SetBenefitStatusVariables = {
  input: {
    id: string;
    isActive: boolean;
  };
};

export const BENEFIT_CATALOG_QUERY = gql`
  query BenefitCatalogPage {
    allBenefits {
      id
      title
      description
      category
      categoryId
      approvalRole
      isActive
      isCore
      requiresContract
      subsidyPercent
      vendorName
    }
  }
`;

export const SET_BENEFIT_STATUS_MUTATION = gql`
  mutation SetBenefitStatus($input: SetBenefitStatusInput!) {
    setBenefitStatus(input: $input) {
      id
      isActive
    }
  }
`;
