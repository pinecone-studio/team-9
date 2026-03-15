import { Info, Plus, Trash2 } from "lucide-react";

import type { AssignedBenefitRule, RuleOption } from "./edit-benefit-dialog.types";

type EditBenefitRulesSectionProps = {
  assignedRules: AssignedBenefitRule[];
  availableRules: RuleOption[];
  isCore: boolean;
  onAddRule: () => void;
  onDeleteRule: (ruleId: string) => void;
  onSelectedRuleIdChange: (value: string) => void;
  selectedRuleId: string;
};

function prettifyValue(value: string, defaultUnit?: string | null) {
  let displayValue = value;

  try {
    const parsed = JSON.parse(value);
    displayValue = typeof parsed === "string" ? parsed : String(parsed);
  } catch {
    displayValue = value;
  }

  return defaultUnit ? `${displayValue} ${defaultUnit}` : displayValue;
}

function buildRuleSummary(rule: AssignedBenefitRule) {
  return `${rule.name} ${rule.operator} ${prettifyValue(rule.value, rule.defaultUnit)}`;
}

export default function EditBenefitRulesSection({
  assignedRules,
  availableRules,
  isCore,
  onAddRule,
  onDeleteRule,
  onSelectedRuleIdChange,
  selectedRuleId,
}: EditBenefitRulesSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-[5px]">
        <h3 className="text-[16px] leading-4 font-semibold text-black">Eligibility Rules</h3>
        <p className="text-[12px] leading-4 font-normal text-[#5B6470]">
          All rules must pass for employees to become eligible.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select
          className="h-9 flex-1 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-5 text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none disabled:bg-[#F8FAFC] disabled:text-[#94A3B8]"
          disabled={isCore || availableRules.length === 0}
          onChange={(event) => onSelectedRuleIdChange(event.target.value)}
          value={selectedRuleId}
        >
          <option value="">Select a rule definition</option>
          {availableRules.map((rule) => (
            <option key={rule.id} value={rule.id}>
              {rule.name}
            </option>
          ))}
        </select>
        <button
          className="flex h-9 items-center justify-center gap-2 rounded-[8px] bg-[#171717] px-3 text-[14px] leading-5 font-medium text-[#FAFAFA] disabled:cursor-not-allowed disabled:bg-[#A3A3A3]"
          disabled={isCore || !selectedRuleId}
          onClick={onAddRule}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      {isCore ? (
        <div className="rounded-[10px] border border-[#CBD5E1] bg-[rgba(245,245,245,0.3)] p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-1 h-4 w-4 shrink-0 text-[#737373]" />
            <div className="flex flex-col gap-1">
              <p className="text-[16px] leading-6 font-medium text-[#0A0A0A]">Core Benefit Rule</p>
              <p className="text-[14px] leading-5 text-[#737373]">
                Core benefits always use the fixed condition: employment status is not terminated.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {assignedRules.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-[#CBD5E1] px-4 py-6 text-[14px] leading-5 text-[#64748B]">
              No rules selected yet.
            </div>
          ) : (
            assignedRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-start justify-between rounded-[10px] border border-[#CBD5E1] bg-[rgba(245,245,245,0.3)] p-4"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[16px] leading-6 font-medium text-[#0A0A0A]">{rule.name}</p>
                    <Info className="h-4 w-4 text-[#737373]" />
                  </div>
                  <p className="text-[14px] leading-5 text-[#737373]">{buildRuleSummary(rule)}</p>
                </div>
                <button
                  className="ml-4 flex h-6 w-6 items-center justify-center text-[#737373]"
                  onClick={() => onDeleteRule(rule.id)}
                  type="button"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
