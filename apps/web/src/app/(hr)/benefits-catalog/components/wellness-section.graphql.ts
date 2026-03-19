import { gql } from "@apollo/client";

import type { BenefitCatalogRecord } from "../benefit-types";

export type BenefitCategoryRecord = {
  id: string;
  name: string;
};

export type BenefitEligibilitySummaryRecord = {
  activeEmployees: number;
  benefitId: string;
  eligibleEmployees: number;
};

export type BenefitCatalogQuery = {
  activeBenefitContracts: Array<{
    benefitId: string;
    effectiveDate: string;
    expiryDate: string;
    id: string;
    isActive: boolean;
    vendorName: string;
    version: string;
  }>;
  allBenefits?: Array<BenefitCatalogRecord | null> | null;
  benefitCategories: BenefitCategoryRecord[];
  listBenefitEligibilitySummary: BenefitEligibilitySummaryRecord[];
};

export type CreateBenefitCategoryMutation = {
  createBenefitCategory: BenefitCategoryRecord;
};

export type CreateBenefitCategoryVariables = {
  name: string;
};

export type DeleteBenefitCategoryMutation = {
  deleteBenefitCategory: boolean;
};

export type DeleteBenefitCategoryVariables = {
  id: string;
};

export const BENEFIT_CATALOG_QUERY = gql`
  query BenefitCatalogPage {
    benefitCategories {
      id
      name
    }
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
    listBenefitEligibilitySummary {
      benefitId
      activeEmployees
      eligibleEmployees
    }
    activeBenefitContracts {
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

export const CREATE_BENEFIT_CATEGORY_MUTATION = gql`
  mutation CreateBenefitCategory($name: String!) {
    createBenefitCategory(name: $name) {
      id
      name
    }
  }
`;

export const DELETE_BENEFIT_CATEGORY_MUTATION = gql`
  mutation DeleteBenefitCategory($id: ID!) {
    deleteBenefitCategory(id: $id)
  }
`;
