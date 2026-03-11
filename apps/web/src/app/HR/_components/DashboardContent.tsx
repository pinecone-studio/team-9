import EligibilityDistributionIcon from "../_icons/EligibilityDistribution";
import PaperIcon from "../_icons/Paper";
import RefreshIcon from "../_icons/Refresh";
import WarningIcon from "../_icons/Warning";

const employeeKpis = [
  { label: "OKR Submitted", value: "53%" },
  { label: "Attendance Compliance", value: "83%" },
  { label: "Request Approval", value: "34%" },
];

const eligibilityLegend = [
  { color: "#3f7ae8", label: "Eligible" },
  { color: "#29c159", label: "Active" },
  { color: "#e7b106", label: "Pending" },
  { color: "#f24949", label: "Locked" },
];

const recentActivity = Array.from({ length: 4 }, () => ({
  author: "Sarah Chen",
  title: "Employee requested Gym Membership benefit",
  when: "1 day ago",
}));

const attendanceAlerts = [
  { count: "4 late", initials: "TE", name: "Tuguldur Enk..." },
  { count: "2 late", initials: "TE", name: "Tuguldur Enk..." },
];

export default function DashboardContent() {
  return (
    <div className="grid w-full gap-5 xl:grid-cols-[360px_360px_540px] xl:items-start">
      <article className="rounded-[22px] bg-[#050505] p-6 text-white shadow-[0_22px_42px_rgba(0,0,0,0.22)]">
        <p className="text-[15px] font-semibold text-white/95">
          Employees Overall
        </p>

        <div className="mt-7 flex items-end gap-5">
          <div>
            <p className="text-[48px] font-semibold leading-none">24</p>
            <p className="mt-2 text-[15px] text-white/45">Total Employees</p>
          </div>

          <div className="h-14 w-px bg-white/15" />

          <div>
            <p className="text-[48px] font-semibold leading-none">4</p>
            <p className="mt-2 text-[15px] text-white/45">On Probation</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {employeeKpis.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-[18px] bg-white/11 px-3 py-3.5 text-center backdrop-blur-sm"
            >
              <p className="text-[18px] font-semibold">{value}</p>
              <p className="mt-1 text-[12px] leading-5 text-white/45">
                {label}
              </p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[22px] border border-[#e7e1e1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-semibold text-slate-950">
              Eligibility Distribution
            </h2>
            <p className="mt-6 text-[15px] leading-6 text-slate-500">
              <span className="font-medium text-[#2d70f5]">+12% Eligible</span>{" "}
              compared to last month
            </p>
          </div>

          <EligibilityDistributionIcon className="mt-1 h-5 w-6" />
        </div>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="space-y-3">
            {eligibilityLegend.map(({ color, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-[15px] text-slate-500"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <EligibilityDonut />
        </div>
      </article>

      <article className="rounded-[22px] border border-[#e7e1e1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[16px] font-semibold text-slate-950">
            Recent Activity
          </h2>
          <RefreshIcon className="h-5 w-5" />
        </div>

        <div className="mt-7 space-y-5 overflow-hidden">
          {recentActivity.map(({ author, title, when }, index) => (
            <div
              key={`${title}-${index}`}
              className={`flex items-start gap-4 ${
                index === recentActivity.length - 1 ? "opacity-[0.18]" : ""
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0d0d0d] text-white">
                <PaperIcon className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-slate-950">
                  {title}
                </p>
                <p className="mt-2 truncate text-[15px] text-slate-500">
                  {author}
                  <span className="px-2 text-slate-300">•</span>
                  {when}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[22px] border border-[#e7e1e1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)] sm:p-6 xl:col-start-3 xl:w-[360px] xl:justify-self-end">
        <div className="flex items-center gap-3">
          <WarningIcon className="h-5 w-6" />
          <h2 className="text-[16px] font-semibold text-slate-950">
            Attendance Alerts
          </h2>
        </div>

        <div className="mt-6 space-y-5">
          {attendanceAlerts.map(({ count, initials, name }) => (
            <div
              key={`${name}-${count}`}
              className="flex items-center justify-between gap-4 rounded-[14px] border border-[#f0b83b] bg-[#fffaf1] px-3.5 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d8dce6] text-[15px] font-medium text-slate-600">
                  {initials}
                </span>
                <p className="truncate text-[15px] font-medium text-slate-950">
                  {name}
                </p>
              </div>

              <span className="shrink-0 rounded-[10px] border border-[#f0b83b] bg-white px-3 py-1 text-[14px] text-[#d0890d]">
                {count}
              </span>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

function EligibilityDonut() {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { color: "#3f7ae8", length: 58, offset: 0 },
    { color: "#29c159", length: 52, offset: 70 },
    { color: "#f24949", length: 50, offset: 136 },
    { color: "#e7b106", length: 26, offset: 198 },
  ];

  return (
    <svg
      aria-hidden="true"
      className="h-36 w-36 shrink-0"
      viewBox="0 0 140 140"
    >
      <g transform="rotate(-90 70 70)">
        {segments.map(({ color, length, offset }) => (
          <circle
            key={color}
            cx="70"
            cy="70"
            fill="none"
            r={radius}
            stroke={color}
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            strokeWidth="20"
          />
        ))}
      </g>
      <circle cx="70" cy="70" fill="white" r="32" />
    </svg>
  );
}
