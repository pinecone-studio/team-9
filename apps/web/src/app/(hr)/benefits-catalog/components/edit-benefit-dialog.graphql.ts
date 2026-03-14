import { gql } from "@apollo/client";

export type UpdatedBenefitPayload = {
  category: string;
  categoryId: string;
  description: string;
  id: string;
  subsidyPercent?: number | null;
  title: string;
  vendorName?: string | null;
};

export type DeleteBenefitMutation = {
  deleteBenefit: boolean;
};

export type DeleteBenefitVariables = {
  id: string;
};

export type UpdateBenefitMutation = {
  updateBenefit: UpdatedBenefitPayload;
};

export type UpdateBenefitVariables = {
  input: {
    categoryId: string;
    description: string;
    id: string;
    name: string;
    subsidyPercent: number;
    vendorName?: string | null;
  };
};

export const DELETE_BENEFIT_MUTATION = gql`
  mutation DeleteBenefit($id: ID!) {
    deleteBenefit(id: $id)
  }
`;

export const UPDATE_BENEFIT_MUTATION = gql`
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
