"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

import ApprovalRequestCard from "./ApprovalRequestCard";
import ApprovalRequestReviewDialog from "./ApprovalRequestReviewDialog";
import RequestStatusTabs from "./RequestStatusTabs";
import {
  APPROVAL_REQUESTS_QUERY,
  type ApprovalRequestRecord,
  type ApprovalRequestsQuery,
} from "./approval-requests.graphql";

const EMPTY_REQUESTS: ApprovalRequestRecord[] = [];

export default function RequestsBoard() {
  const [activeTab, setActiveTab] = useState<"pending" | "processed">("pending");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const { data, error, loading, refetch } =
    useQuery<ApprovalRequestsQuery>(APPROVAL_REQUESTS_QUERY, {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    });
  const requests = data?.approvalRequests ?? EMPTY_REQUESTS;
  const pendingRequests = useMemo(() => {
    return requests.filter((request) => request.status === "pending");
  }, [requests]);
  const processedRequests = useMemo(() => {
    return requests.filter((request) => request.status !== "pending");
  }, [requests]);
  const visibleRequests: ApprovalRequestRecord[] =
    activeTab === "pending" ? pendingRequests : processedRequests;

  return (
    <>
      <RequestStatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingRequests.length}
        processedCount={processedRequests.length}
      />

      <section className="mt-[49px] flex flex-col gap-7 px-[70px] pb-10">
        {loading ? (
          <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-6 py-8 text-[14px] leading-6 text-[#64748B]">
            Loading approval requests...
          </div>
        ) : error ? (
          <div className="rounded-[10px] border border-[#F3C7C7] bg-[#FFF7F7] px-6 py-8 text-[14px] leading-6 text-[#B42318]">
            Approval requests could not be loaded.
          </div>
        ) : visibleRequests.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[#CBD5E1] bg-white px-6 py-10 text-center text-[14px] leading-6 text-[#64748B]">
            {activeTab === "pending"
              ? "No pending approval requests right now."
              : "No processed approval requests yet."}
          </div>
        ) : (
          visibleRequests.map((request) => (
            <ApprovalRequestCard
              key={request.id}
              onReview={setSelectedRequestId}
              request={request}
            />
          ))
        )}
      </section>

      {selectedRequestId ? (
        <ApprovalRequestReviewDialog
          onClose={() => setSelectedRequestId(null)}
          onReviewed={refetch}
          requestId={selectedRequestId}
        />
      ) : null}
    </>
  );
}
