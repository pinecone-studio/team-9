import Link from "next/link";
import { Show, SignOutButton } from "@clerk/nextjs";
import DashboardIcon from "@/app/HR/_icons/Dashboard";
import RequestsIcon from "@/app/HR/_icons/Requests";

type EmployeeNavProps = {
  employeeName: string;
};

const employeeNavItems = [
  {
    href: "/Employee",
    icon: DashboardIcon,
    isActive: true,
    key: "dashboard",
    label: "Dashboard",
    withBadge: false,
  },
  {
    href: "/Employee#my-requests",
    icon: RequestsIcon,
    isActive: false,
    key: "my-requests",
    label: "My Requests",
    withBadge: true,
  },
] as const;

export function EmployeeNav({ employeeName }: EmployeeNavProps) {
  const initials = employeeName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="mx-auto h-[78px] w-full max-w-[860px] rounded-2xl border border-[#e6e1e1] bg-white px-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
      <div className="flex h-full items-center gap-6">
        <nav
          aria-label="Employee sections"
          className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex min-w-max items-start gap-4">
            {employeeNavItems.map(
              ({ href, icon: Icon, isActive, key, label, withBadge }) => (
                <li key={key} className="flex h-[54px] shrink-0 items-center">
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex w-[100px] flex-col items-center justify-center gap-2 rounded-xl text-[13px] leading-none whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                      isActive
                        ? "h-[54px] text-slate-950"
                        : "h-[44px] text-slate-500 hover:text-slate-700"
                    }`}
                    href={href}
                  >
                    <span className="flex h-7 items-center justify-center">
                      <Icon
                        className={`transition-colors ${
                          isActive
                            ? "h-[34px] w-[34px] text-slate-950"
                            : "h-6 w-6 text-slate-500 group-hover:text-slate-700"
                        }`}
                      />
                    </span>
                    <span className={isActive ? "font-semibold" : "font-medium"}>
                      {label}
                    </span>
                    {withBadge ? (
                      <span className="absolute right-[20px] top-[8px] h-[9px] w-[9px] rounded-full bg-[#EF4444]" />
                    ) : null}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex h-full w-8 shrink-0 items-center justify-center">
          <div className="h-11 w-px bg-[#e6e1e1]" />
        </div>

        <Show when="signed-in">
          <SignOutButton>
            <button
              aria-label="Log out"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8d7d4] bg-[#f8f7f4] text-[14px] font-semibold leading-none text-slate-700 transition-colors hover:bg-white"
              type="button"
            >
              {initials || "U"}
            </button>
          </SignOutButton>
        </Show>
        <Show when="signed-out">
          <Link
            aria-label="Sign in"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8d7d4] bg-[#f8f7f4] text-[14px] font-semibold leading-none text-slate-700 transition-colors hover:bg-white"
            href="/auth/login"
          >
            {initials || "U"}
          </Link>
        </Show>
      </div>
    </div>
  );
}
