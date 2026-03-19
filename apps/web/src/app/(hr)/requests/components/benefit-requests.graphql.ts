import {
  HrBenefitRequestContractDocument,
  HrBenefitRequestsDocument,
  HrReviewBenefitRequestDocument,
  type HrBenefitRequestContractQuery,
  type HrBenefitRequestContractQueryVariables,
  type HrBenefitRequestsQuery,
  type HrReviewBenefitRequestMutation,
  type HrReviewBenefitRequestMutationVariables,
} from "@/shared/apollo/generated";

export type BenefitRequestRecord = HrBenefitRequestsQuery["benefitRequests"][number];
export type BenefitRequestsQuery = HrBenefitRequestsQuery;
export type ReviewBenefitRequestMutation = HrReviewBenefitRequestMutation;
export type BenefitRequestContractQuery = HrBenefitRequestContractQuery;
export type BenefitRequestContractVariables = HrBenefitRequestContractQueryVariables;
export type ReviewBenefitRequestVariables = HrReviewBenefitRequestMutationVariables;

export const BENEFIT_REQUESTS_QUERY = HrBenefitRequestsDocument;
export const REVIEW_BENEFIT_REQUEST_MUTATION = HrReviewBenefitRequestDocument;
export const BENEFIT_REQUEST_CONTRACT_QUERY = HrBenefitRequestContractDocument;
