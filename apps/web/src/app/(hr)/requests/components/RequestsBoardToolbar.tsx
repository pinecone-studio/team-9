import type { RequestsMetricKey } from "./RequestsBoardMetrics";
import { METRIC_LABELS, type RequestsBoardTab } from "./requests-board-filters";

type RequestsBoardToolbarProps = {
  activeMetric: RequestsMetricKey | null;
  activeTab: RequestsBoardTab;
  benefitCount: number;
  configurationCount: number;
  onClearFilter: () => void;
  onTabChange: (tab: RequestsBoardTab) => void;
};

function ToolbarTab({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex h-[29px] items-center gap-[14px] rounded-[8px] px-3 text-[14px] leading-5 font-medium transition ${
        active
          ? "bg-white text-[#0A0A0A] shadow-[0_2px_4px_rgba(0,0,0,0.14)]"
          : "text-[#0A0A0A]"
      }`}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <span className={`inline-flex h-[22px] min-w-[26px] items-center justify-center rounded-[8px] px-2 text-[12px] leading-4 ${
        active ? "bg-[#DBEAFE] text-[#171717]" : "text-[#1447E6]"
      }`}>
        {count}
      </span>
    </button>
  );
}

export default function RequestsBoardToolbar({
  activeMetric,
  activeTab,
  benefitCount,
  configurationCount,
  onClearFilter,
  onTabChange,
}: RequestsBoardToolbarProps) {
  return (
    <>
      {activeMetric ? (
        <div className="flex items-center gap-3 text-[14px] leading-5">
          <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[#1447E6]">
            Filtered by {METRIC_LABELS[activeMetric]}
          </span>
          <button
            className="font-medium text-[#525252] transition hover:text-[#0A0A0A]"
            onClick={onClearFilter}
            type="button"
          >
            Clear filter
          </button>
        </div>
      ) : null}
      <div className="inline-flex w-fit items-center rounded-[10px] bg-[#F5F5F5] p-[3px]">
        <ToolbarTab
          active={activeTab === "benefit"}
          count={benefitCount}
          label="Benefit Requests"
          onClick={() => onTabChange("benefit")}
        />
        <ToolbarTab
          active={activeTab === "configuration"}
          count={configurationCount}
          label="Configuration Approvals"
          onClick={() => onTabChange("configuration")}
        />
      </div>
    </>
  );
}
