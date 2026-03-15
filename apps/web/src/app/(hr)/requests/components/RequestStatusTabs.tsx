import { CheckCircle2, Clock3 } from "lucide-react";

type RequestStatusTabsProps = {
  activeTab: "pending" | "processed";
  pendingCount: number;
  processedCount: number;
  onTabChange: (tab: "pending" | "processed") => void;
};

export default function RequestStatusTabs({
  activeTab,
  pendingCount,
  processedCount,
  onTabChange,
}: RequestStatusTabsProps) {
  return (
    <section className="mt-[48px] ml-[70px] w-[240px] rounded-[8px] bg-[#F0F2F5] p-[3px]">
      <div className="relative flex h-[25px] items-center">
        <button
          className={`flex h-[25px] w-[122px] items-center gap-[10px] rounded-[8px] px-[7px] py-1 ${
            activeTab === "pending" ? "bg-white" : "bg-transparent"
          }`}
          onClick={() => onTabChange("pending")}
          type="button"
        >
          <span className="flex items-center gap-[5px]">
            <Clock3 className="h-4 w-4 text-black" />
            <span className="text-[12px] leading-4 font-semibold text-black">
              Pending
            </span>
          </span>
          <span className="flex h-[19px] w-5 items-center justify-center rounded-[6px] bg-[#F5F6F7] text-[10px] leading-[13px] font-semibold text-black">
            {pendingCount}
          </span>
        </button>

        <button
          className={`absolute top-0 right-0 flex h-[25px] items-center gap-[5px] rounded-[8px] px-[7px] py-1 ${
            activeTab === "processed" ? "bg-white" : ""
          }`}
          onClick={() => onTabChange("processed")}
          type="button"
        >
          <CheckCircle2 className="h-4 w-4 text-black" />
          <span className="text-[12px] leading-4 font-semibold text-black">
            Processed
          </span>
          <span className="flex h-[19px] min-w-5 items-center justify-center rounded-[6px] bg-[#F5F6F7] px-1 text-[10px] leading-[13px] font-semibold text-black">
            {processedCount}
          </span>
        </button>
      </div>
    </section>
  );
}
