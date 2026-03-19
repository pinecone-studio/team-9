"use client";

export default function EmployeeDirectoryDialogLoading({
  className,
}: {
  className: string;
}) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}
