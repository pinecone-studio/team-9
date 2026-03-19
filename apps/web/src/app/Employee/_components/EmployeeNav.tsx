"use client";

import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { SignOutAvatarButton } from "@/shared/auth/SignOutAvatarButton";

type EmployeeNavProps = {
  employeeName: string;
  variant?: "default" | "hero";
};

export function EmployeeNav({
  employeeName,
  variant = "default",
}: EmployeeNavProps) {
  const initials = employeeName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  const isHero = variant === "hero";
  const avatarClassName = isHero
    ? [
        "inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/35",
        "bg-white/78 text-[20px] font-medium leading-none text-[#24324A]",
        "shadow-[0_14px_32px_rgba(17,24,39,0.16)] backdrop-blur-[10px]",
        "transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75",
      ].join(" ")
    : [
        "inline-flex h-11 w-11 items-center justify-center rounded-[20px]",
        "bg-slate-200 text-[16px] font-normal leading-[19px] text-slate-900",
        "transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
      ].join(" ");

  return (
    <nav
      aria-label="Employee account"
      className={isHero ? "flex justify-end" : "flex w-full justify-end"}
    >
      <div
        className={
          isHero
            ? "flex items-center justify-center"
            : [
                "flex h-[68px] w-[76px] items-center justify-center rounded-[10px]",
                "border-2 border-[#F3F3F3] bg-white px-4 py-3",
                "shadow-[0px_3px_8px_rgba(0,0,0,0.03),0px_14px_14px_rgba(0,0,0,0.02),0px_31px_19px_rgba(0,0,0,0.01)]",
              ].join(" ")
        }
      >
        <Show when="signed-in">
          <SignOutAvatarButton
            className={avatarClassName}
            displayName={employeeName}
          />
        </Show>
        <Show when="signed-out">
          <Link
            aria-label="Sign in"
            className={avatarClassName}
            href="/auth/login"
          >
            {initials || "U"}
          </Link>
        </Show>
      </div>
    </nav>
  );
}
