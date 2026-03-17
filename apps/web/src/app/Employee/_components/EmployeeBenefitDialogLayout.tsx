"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { getBadgeClass, StatusBadgeIcon } from "./benefit-card-ui";
import type { EmployeeBenefitCard } from "./employee-types";

type EmployeeBenefitDialogLayoutProps = {
  card: EmployeeBenefitCard;
  children: ReactNode;
  onClose: () => void;
};

export default function EmployeeBenefitDialogLayout({
  card,
  children,
  onClose,
}: EmployeeBenefitDialogLayoutProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex min-h-full items-center justify-center">
        <div className="relative w-full max-w-[512px] rounded-[12px] border border-[#CBD5E1] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)] sm:w-[512px]">
          <button
            className="absolute top-1 right-1 rounded-[8px] p-2 text-[#737373]"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-6 px-8 py-7">
            <div className="flex min-w-0 flex-col gap-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-[20px] leading-7 font-semibold text-[#0A0A0A]">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-5 text-[#737373]">
                    {card.categoryName}
                  </p>
                </div>
                <span
                  className={[
                    "inline-flex items-center gap-[6px] rounded-[8px] px-3 py-2 text-[12px] font-medium leading-4",
                    getBadgeClass(card.status),
                  ].join(" ")}
                >
                  <StatusBadgeIcon status={card.status} />
                  {card.status}
                </span>
              </div>

              <p className="text-[14px] leading-5 text-[#0A0A0A]">{card.description}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[14px] leading-5 text-[#737373]">Subsidy</p>
                  <p className="mt-1 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                    {card.subsidyPercent !== null ? `${card.subsidyPercent}%` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[14px] leading-5 text-[#737373]">Vendor</p>
                  <p className="mt-1 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                    {card.vendorName ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-7">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
