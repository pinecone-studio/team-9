import { History } from "lucide-react";

type AuditEntry = {
  actor: string;
  id: string;
  label: string;
  timestamp: string;
  tone?: "danger" | "neutral" | "success";
};

export function AuditLogSection({
  entries,
  formatTimestamp,
}: {
  entries: AuditEntry[];
  formatTimestamp: (value: string) => string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-[#0A0A0A]" />
        <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Audit Log</h3>
      </div>
      <div className="flex flex-col">
        {entries.map((entry, index) => (
          <div className="flex min-h-[48px] gap-3" key={entry.id}>
            <div className="flex w-[6px] flex-col items-center">
              <span
                className={[
                  "mt-[8px] h-[6px] w-[6px] rounded-full",
                  entry.tone === "success"
                    ? "bg-[#22C55E]"
                    : entry.tone === "danger"
                      ? "bg-[#EF4444]"
                      : "bg-[#D4D4D8]",
                ].join(" ")}
              />
              {index < entries.length - 1 ? <span className="h-full w-px bg-[#E5E7EB]" /> : null}
            </div>
            <div className="pb-3 pt-[1px]">
              <p className="text-[14px] leading-5 text-[#0A0A0A]">{entry.label}</p>
              <p className="text-[12px] leading-4 text-[#737373]">
                {`${formatTimestamp(entry.timestamp)}${
                  entry.actor
                    ? entry.actor.startsWith("by ")
                      ? ` ${entry.actor}`
                      : ` · ${entry.actor}`
                    : ""
                }`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
