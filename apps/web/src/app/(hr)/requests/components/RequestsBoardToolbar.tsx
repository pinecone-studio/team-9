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

const TAB_WIDTHS: Record<RequestsBoardTab, string> = {
  benefit: "w-fit",
  configuration: "w-fit",
  override: "w-fit",
};

function ToolbarTab({
  active,
  count,
  label,
  onClick,
  tab,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
  tab: RequestsBoardTab;
}) {
  return (
    <button
      className={`inline-flex h-[44px] shrink-0 items-center justify-center gap-4 rounded-[14px] px-[18px] py-[10px] font-sans text-center text-[14px] leading-5 font-medium text-[#0A0A0A] transition ${TAB_WIDTHS[tab]} ${
        active
          ? "bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
          : "bg-transparent"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center text-center text-[14px] leading-5 font-medium text-[#0A0A0A]">{label}</span>
      <span
        className={`inline-flex min-w-[24px] items-center justify-center rounded-[10px] text-center text-[14px] leading-5 font-medium ${
          active
            ? "h-8 bg-[#DBEAFE] px-3 text-[#2563EB]"
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
    <div className="flex flex-col gap-4">
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
          className="inline-flex h-[56px] min-w-max items-center justify-center rounded-[18px] bg-[#F5F5F5] p-[6px]"
          role="tablist"
        >
          <ToolbarTab
            active={activeTab === "benefit"}
            count={benefitCount}
            label="Benefit Requests"
            onClick={() => onTabChange("benefit")}
            tab="benefit"
          />
          <ToolbarTab
            active={activeTab === "configuration"}
            count={configurationCount}
            label="Configuration Approvals"
            onClick={() => onTabChange("configuration")}
            tab="configuration"
          />
          <ToolbarTab
            active={activeTab === "override"}
            count={overrideCount}
            label="Override Requests"
            onClick={() => onTabChange("override")}
            tab="override"
          />
        </div>
      </div>
    </div>
  );
}
