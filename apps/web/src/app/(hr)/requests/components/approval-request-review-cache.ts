import type { ApolloCache } from "@apollo/client";

import {
  APPROVAL_REQUESTS_QUERY,
  APPROVAL_REQUEST_QUERY,
  type ApprovalRequestsQuery,
  type ApprovalRequestQuery,
  type ApprovalRequestQueryVariables,
  type ApprovalRequestRecord,
} from "./approval-requests.graphql";
import { removePendingApprovalRequestFromNavCache } from "./pending-requests-count-cache";

export function updateApprovalRequestReviewCache(
  cache: ApolloCache,
  reviewedRequest: ApprovalRequestRecord | null | undefined,
) {
  if (!reviewedRequest) {
    return;
  }

  cache.writeQuery<ApprovalRequestQuery, ApprovalRequestQueryVariables>({
    query: APPROVAL_REQUEST_QUERY,
    variables: { id: reviewedRequest.id },
    data: {
      approvalRequest: reviewedRequest,
    },
  });

  cache.updateQuery<ApprovalRequestsQuery>(
    {
      query: APPROVAL_REQUESTS_QUERY,
    },
    (existingData) => {
      if (!existingData) {
        return existingData;
      }

      return {
        approvalRequests: existingData.approvalRequests.map((item) =>
          item.id === reviewedRequest.id ? reviewedRequest : item,
        ),
      };
    },
  );

  if (reviewedRequest.status !== "pending") {
    removePendingApprovalRequestFromNavCache(cache, reviewedRequest.id);
  }
}
