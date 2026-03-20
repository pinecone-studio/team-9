import type { ApolloCache } from "@apollo/client";
import {
  RequestsNavBadgeDocument,
  type RequestsNavBadgeQuery,
} from "@/shared/apollo/generated";

function updateRequestsNavBadgeCache(
  cache: ApolloCache,
  updater: (existingData: RequestsNavBadgeQuery) => RequestsNavBadgeQuery,
) {
  cache.updateQuery<RequestsNavBadgeQuery>(
    { query: RequestsNavBadgeDocument },
    (existingData: RequestsNavBadgeQuery | null) => {
      if (!existingData) {
        return existingData;
      }

      return updater(existingData);
    },
  );
}

export function removePendingApprovalRequestFromNavCache(
  cache: ApolloCache,
  requestId: string,
) {
  updateRequestsNavBadgeCache(cache, (existingData) => ({
    ...existingData,
    approvalRequests: existingData.approvalRequests.filter(
      (request) => request.id !== requestId,
    ),
  }));
}

export function decrementPendingBenefitRequestsInNavCache(cache: ApolloCache) {
  updateRequestsNavBadgeCache(cache, (existingData) => ({
    ...existingData,
    countPendingBenefitRequests: Math.max(
      0,
      existingData.countPendingBenefitRequests - 1,
    ),
  }));
}
