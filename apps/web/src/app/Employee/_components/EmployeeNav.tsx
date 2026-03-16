import { employeeNavItems } from "./employee-data";

type EmployeeNavProps = {
  employeeName: string;
};

export function EmployeeNav({ employeeName }: EmployeeNavProps) {
  return (
    <nav
      className={[
        "absolute top-[27px] flex h-[68px] w-[320px] items-center justify-center",
        "gap-[21px] rounded-[10px] border-2 border-[#F3F3F3] bg-white",
        "px-[16px] py-[12px]",
        "shadow-[0px_3px_8px_rgba(0,0,0,0.03),0px_14px_14px_rgba(0,0,0,0.02),0px_31px_19px_rgba(0,0,0,0.01)]",
      ].join(" ")}
      style={{ left: "calc(50% - 320px / 2 - 490px)" }}
    >
      {employeeNavItems.map(({ icon: Icon, label }) => (
        <button
          className="flex flex-col items-center gap-1 text-[10px] font-semibold text-[#6B7280]"
          key={label}
          type="button"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F8F9FB] text-[#111827]">
            <Icon className="h-4 w-4" />
          </span>
          {label}
        </button>
      ))}
      <span className="h-[32px] w-px bg-[#E5E7EB]" />
      <button
        className={[
          "inline-flex h-[36px] w-[36px] items-center justify-center rounded-full",
          "bg-[#EEF2F7] text-[12px] font-semibold text-[#6B7280]",
        ].join(" ")}
        type="button"
        aria-label="User avatar"
      >
        {employeeName.charAt(0).toUpperCase()}
      </button>
    </nav>
  );
}
