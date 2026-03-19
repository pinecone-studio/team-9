import type { RequestsMetricKey } from "./RequestsBoardMetrics";
import { METRIC_LABELS, type RequestsBoardTab } from "./requests-board-filters";

type RequestsBoardToolbarProps = {
  activeMetric: RequestsMetricKey | null;
  activeTab: RequestsBoardTab;
  benefitCount: number;
  configurationCount: number;
  onClearFilter: () => void;
  onTabChange: (tab: RequestsBoardTab) => void;
  overrideCount: number;
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
      className={`inline-flex h-[58px] shrink-0 items-center justify-center gap-[16px] rounded-[18px] px-[24px] py-[11px] font-sans text-center text-[16px] leading-6 font-medium text-[#171717] transition ${
        active
          ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center text-center text-[16px] leading-6 font-medium text-[#171717]">
        {label}
      </span>
      <span
        className={`inline-flex min-w-[24px] items-center justify-center rounded-[12px] text-center text-[16px] leading-6 font-medium ${
          active
            ? "h-[42px] bg-[#DBEAFE] px-[16px] text-[#3B72F6]"
            : "h-auto px-0 text-[#262626]"
        }`}
      >
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
  overrideCount,
}: RequestsBoardToolbarProps) {
  return (
    <div className="flex flex-col gap-5">
      {activeMetric ? (
        <div className="flex items-center gap-3 text-[14px] leading-5">
          <span className="rounded-full bg-[#EFF6FF] px-3 py-1.5 text-[#1447E6]">
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

      <div className="overflow-x-auto">
        <div
          aria-label="Request sections"
          className="inline-flex min-w-max items-center gap-[10px]"
          role="tablist"
        >
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
          <ToolbarTab
            active={activeTab === "override"}
            count={overrideCount}
            label="Override Requests"
            onClick={() => onTabChange("override")}
          />
        </div>
      </div>
    </div>
  );
}
