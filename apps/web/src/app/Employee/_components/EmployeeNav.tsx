"use client";

import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { SignOutAvatarButton } from "@/shared/auth/SignOutAvatarButton";

type EmployeeNavProps = {
  employeeName: string;
};

export function EmployeeNav({ employeeName }: EmployeeNavProps) {
  const initials = employeeName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <nav aria-label="Employee account" className="flex w-full justify-end">
      <div
        className={[
          "flex h-[68px] w-[76px] items-center justify-center rounded-[10px]",
          "border-2 border-[#F3F3F3] bg-white px-4 py-3",
          "shadow-[0px_3px_8px_rgba(0,0,0,0.03),0px_14px_14px_rgba(0,0,0,0.02),0px_31px_19px_rgba(0,0,0,0.01)]",
        ].join(" ")}
      >
        <Show when="signed-in">
          <SignOutAvatarButton
            className="inline-flex h-11 w-11 items-center justify-center rounded-[20px] bg-slate-200 text-[16px] font-normal leading-[19px] text-slate-900 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            displayName={employeeName}
          />
        </Show>
        <Show when="signed-out">
          <Link
            aria-label="Sign in"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[20px] bg-slate-200 text-[16px] font-normal leading-[19px] text-slate-900 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            href="/auth/login"
          >
            {initials || "U"}
          </Link>
        </Show>
      </div>
    </nav>
  );
}
