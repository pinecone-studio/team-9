import { gql } from "@apollo/client";

export type CreateBenefitMutation = {
  createBenefit: {
    id: string;
    title: string;
  };
};

export type CreateBenefitVariables = {
  input: {
    categoryId: string;
    description: string;
    name: string;
    requiresContract?: boolean;
    subsidyPercent: number;
    vendorName?: string | null;
  };
};

export const CREATE_BENEFIT_MUTATION = gql`
  mutation CreateBenefit($input: CreateBenefitInput!) {
    createBenefit(input: $input) {
      id
      title
    }
  }
`;
