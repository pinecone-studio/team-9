import BenefitRequestsTable from "./BenefitRequestsTable";
import ConfigurationApprovalsTable from "./ConfigurationApprovalsTable";
import { SectionTab, SummaryMetricCard } from "./RequestsUi";
import {
  benefitRequestRows,
  configurationRows,
  summaryCards,
} from "./requests-data";

export default function RequestsBoard() {
  return (
    <section className="mx-auto mt-7 flex w-full max-w-[1300px] flex-col gap-4">
      <header className="flex flex-col items-start gap-3">
        <h1 className="text-[24px] leading-8 font-semibold text-[#0A0A0A]">
          Requests
        </h1>
        <p className="text-[14px] leading-5 font-normal text-[#737373]">
          Review employee benefit requests and configuration changes.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <SummaryMetricCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>

      <section className="mt-1 flex flex-col gap-3">
        <SectionTab count={3} label="Configuration Approvals" />
        <ConfigurationApprovalsTable rows={configurationRows} />
      </section>

      <section className="mt-1 flex flex-col gap-3">
        <SectionTab count={3} label="Benefit Requests" />
        <BenefitRequestsTable rows={benefitRequestRows} />
      </section>
    </section>
  );
}
