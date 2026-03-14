"use client";

import { useMemo, useState } from "react";

import BenefitRequestReviewDialog from "./BenefitRequestReviewDialog";
import { ReviewButton, StatusBadge } from "./RequestsUi";
import type { BenefitRequestRow } from "./requests-data";

export default function BenefitRequestsTable({
  rows,
}: {
  rows: BenefitRequestRow[];
}) {
  const [tableRows, setTableRows] = useState<BenefitRequestRow[]>(rows);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [, setSavedNotes] = useState<Record<string, string>>({});

  const activeRequest = useMemo(
    () => tableRows.find((row) => row.id === activeRequestId) ?? null,
    [activeRequestId, tableRows],
  );

  function handleDecision(decision: "accept" | "reject", notes: string) {
    if (!activeRequestId) return;
    setSavedNotes((current) => ({ ...current, [activeRequestId]: notes.trim() }));
    setTableRows((currentRows) =>
      currentRows.map((row) =>
        row.id === activeRequestId
          ? {
              ...row,
              progress: decision === "accept" ? "Approved" : "Rejected",
              status: decision === "accept" ? "approved" : "rejected",
            }
          : row,
      ),
    );
    setActiveRequestId(null);
    setDecisionNotes("");
  }

  return (
    <>
      <div className="overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1160px] w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Employee
                </th>
                <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Benefit
                </th>
                <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Submitted
                </th>
                <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Approved By
                </th>
                <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Progress
                </th>
                <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${index < tableRows.length - 1 ? "border-b border-[#E5E5E5]" : ""} ${
                    row.status === "pending" ? "" : "opacity-60"
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                        {row.employee}
                      </span>
                      <span className="text-[12px] leading-4 font-normal text-[#737373]">
                        {row.position}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                        {row.benefit}
                      </span>
                      <span className="text-[12px] leading-4 font-normal text-[#737373]">
                        {row.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[14px] leading-5 font-normal text-[#737373]">
                    {row.submitted}
                  </td>
                  <td className="px-4 py-2.5 text-[14px] leading-5 font-normal text-[#737373]">
                    {row.approvedBy}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-[14px] leading-5 font-normal ${
                      row.status === "pending" ? "text-[#E17100]" : "text-[#737373]"
                    }`}
                  >
                    {row.progress}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-2">
                    <ReviewButton
                      label={row.action}
                      onClick={() => {
                        setActiveRequestId(row.id);
                        setDecisionNotes("");
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <BenefitRequestReviewDialog
        notes={decisionNotes}
        onClose={() => {
          setActiveRequestId(null);
          setDecisionNotes("");
        }}
        onDecision={handleDecision}
        onNotesChange={setDecisionNotes}
        request={activeRequest}
      />
    </>
  );
}
