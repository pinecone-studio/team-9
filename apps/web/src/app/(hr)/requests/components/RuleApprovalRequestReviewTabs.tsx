type RuleApprovalReviewTab = "change" | "rule";

type RuleApprovalRequestReviewTabsProps = {
  activeTab: RuleApprovalReviewTab;
  onSelectTab: (tab: RuleApprovalReviewTab) => void;
};

function getTabClassName(isActive: boolean) {
  return isActive
    ? "border border-[#E5E5E5] bg-white text-[#0A0A0A]"
    : "bg-[#F5F5F5] text-[#171717]";
}

export default function RuleApprovalRequestReviewTabs({
  activeTab,
  onSelectTab,
}: RuleApprovalRequestReviewTabsProps) {
  return (
    <div className="flex items-center gap-3">
      {(["rule", "change"] as const).map((tab) => (
        <button
          className={`inline-flex h-[26px] items-center justify-center rounded-[999px] px-3 text-[14px] leading-5 font-medium transition-colors ${getTabClassName(activeTab === tab)}`}
          key={tab}
          onClick={() => onSelectTab(tab)}
          type="button"
        >
          {tab === "rule" ? "Rule" : "Change"}
        </button>
      ))}
    </div>
  );
}
