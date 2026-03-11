type SectionRow = {
  label: string;
  value: string;
};

type SectionCard = {
  description: string;
  rows: readonly SectionRow[];
  title: string;
};

type SidebarItem = {
  detail: string;
  title: string;
};

type SectionPageContentProps = {
  cards: readonly [SectionCard, SectionCard];
  sidebarItems: readonly SidebarItem[];
  sidebarTitle: string;
};

export default function SectionPageContent({
  cards,
  sidebarItems,
  sidebarTitle,
}: SectionPageContentProps) {
  return (
    <div className="grid w-full gap-5 xl:grid-cols-[1fr_1fr_360px] xl:items-start">
      {cards.map(({ description, rows, title }) => (
        <article
          key={title}
          className="rounded-[22px] border border-[#e7e1e1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)] sm:p-6"
        >
          <h2 className="text-[18px] font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 text-[15px] leading-6 text-slate-500">
            {description}
          </p>

          <div className="mt-7 space-y-3">
            {rows.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-[14px] bg-[#f7f7f7] px-4 py-3"
              >
                <span className="text-[15px] text-slate-600">{label}</span>
                <span className="rounded-full bg-white px-3 py-1 text-[13px] font-medium text-slate-950 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </article>
      ))}

      <article className="rounded-[22px] border border-[#e7e1e1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)] sm:p-6 xl:w-90 xl:justify-self-end">
        <h2 className="text-[18px] font-semibold text-slate-950">
          {sidebarTitle}
        </h2>

        <div className="mt-6 space-y-4">
          {sidebarItems.map(({ detail, title }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#ece8e8] bg-[#fbfbfb] px-4 py-4"
            >
              <p className="text-[15px] font-medium text-slate-950">{title}</p>
              <p className="mt-2 text-[14px] leading-6 text-slate-500">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
