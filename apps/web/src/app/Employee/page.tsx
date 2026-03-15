import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";

function formatStatus(status: string | undefined) {
  if (!status) {
    return "Unknown";
  }

  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function EmployeePage() {
  const access = await getCurrentUserAccess();

  if (!access.isAuthenticated) {
    redirect("/auth/login");
  }

  if (access.hasHrAccess) {
    redirect("/dashboard");
  }

  const employee = access.employee;

  return (
    <main className="min-h-screen bg-[#F4F5F7] px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#1f2937_100%)] px-8 py-10 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-300">
              Employee portal
            </p>

            <SignOutButton redirectUrl="/auth/login">
              <button
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/8 px-5 text-sm font-medium text-white transition hover:bg-white/14"
                type="button"
              >
                Sign out
              </button>
            </SignOutButton>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {employee ? `Welcome, ${employee.name}` : "Account linked, profile pending"}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {employee
              ? "Your Clerk account is signed in as an employee-level user. HR-only pages are blocked, and this page can become the landing space for personal benefits and request history."
              : "This Clerk account is signed in, but no matching employee profile was found in the database. Add the same email to the employees table to finish access setup."}
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <article className="rounded-[24px] border border-[#E3E8EF] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold text-[#111827]">
              Identity
            </h2>
            <dl className="mt-5 space-y-4 text-sm text-[#4B5563]">
              <div className="flex items-center justify-between gap-4 border-b border-[#EEF2F7] pb-4">
                <dt>Email</dt>
                <dd className="text-right font-medium text-[#111827]">
                  {access.email ?? "No email on Clerk profile"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#EEF2F7] pb-4">
                <dt>Role</dt>
                <dd className="text-right font-medium text-[#111827]">
                  {employee ? formatStatus(employee.position) : "Not linked"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Portal access</dt>
                <dd className="rounded-full bg-[#EEF2FF] px-3 py-1 font-medium text-[#3730A3]">
                  Employee
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[24px] border border-[#E3E8EF] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold text-[#111827]">
              Employee record
            </h2>
            <dl className="mt-5 space-y-4 text-sm text-[#4B5563]">
              <div className="flex items-center justify-between gap-4 border-b border-[#EEF2F7] pb-4">
                <dt>Department</dt>
                <dd className="text-right font-medium text-[#111827]">
                  {employee?.department ?? "Missing"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#EEF2F7] pb-4">
                <dt>Status</dt>
                <dd className="text-right font-medium text-[#111827]">
                  {employee ? formatStatus(employee.employmentStatus) : "Missing"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Responsibility level</dt>
                <dd className="text-right font-medium text-[#111827]">
                  {employee?.responsibilityLevel ?? "Missing"}
                </dd>
              </div>
            </dl>
          </article>
        </section>
      </div>
    </main>
  );
}
