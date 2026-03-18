"use client";

import RuleRequestNotice from "@/app/(hr)/eligibility-rules/components/RuleRequestNotice";

type BenefitRequestNoticeProps = {
  message: string | null;
  onClose: () => void;
};

export default function BenefitRequestNotice({
  message,
  onClose,
}: BenefitRequestNoticeProps) {
  if (!message) {
    return null;
  }

  return <RuleRequestNotice message={message} onClose={onClose} />;
}
