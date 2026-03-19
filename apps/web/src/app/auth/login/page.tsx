import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getDefaultAppPath } from "@/shared/auth/get-current-user-access";
import r55Image from "../public/r55.png";
import LoginForm from "./LoginForm";
import {
  ACCESS_LOOKUP_FAILURE_QUERY,
  EMAIL_LOOKUP_FAILURE_MESSAGE,
  UNAUTHORIZED_EMAIL_MESSAGE,
  UNAUTHORIZED_EMAIL_QUERY,
} from "./messages";
import UnauthorizedSessionReset from "./UnauthorizedSessionReset";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { userId } = await auth();
  const resolvedSearchParams = (await searchParams) ?? {};
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const hasLookupFailureError = errorParam === ACCESS_LOOKUP_FAILURE_QUERY;
  const hasUnauthorizedEmailError = errorParam === UNAUTHORIZED_EMAIL_QUERY;

  if (userId) {
    const appPath = await getDefaultAppPath();

    if (
      appPath !== `/auth/login?error=${ACCESS_LOOKUP_FAILURE_QUERY}` &&
      appPath !== `/auth/login?error=${UNAUTHORIZED_EMAIL_QUERY}`
    ) {
      redirect(appPath);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F5F7] lg:grid lg:grid-cols-[1fr_1fr]">
      <section className="flex min-h-screen items-center justify-center px-6 py-16 sm:px-10 lg:px-20">
        <div className="w-full max-w-[380px]">
          <div className="mb-9 flex flex-col items-center">
            <h1 className="text-center text-[24px] font-semibold tracking-[-0.03em] text-[#1F252D]">
              Log in with your work email
            </h1>
          </div>

          {userId && hasUnauthorizedEmailError ? (
            <UnauthorizedSessionReset
              redirectUrl={`/auth/login?error=${UNAUTHORIZED_EMAIL_QUERY}`}
            />
          ) : null}
          {hasLookupFailureError ? (
            <p className="mb-4 rounded-xl border border-[#E2B4B4] bg-[#FFF5F5] px-4 py-3 text-sm text-[#8A1C1C]">
              {EMAIL_LOOKUP_FAILURE_MESSAGE}
            </p>
          ) : null}
          {hasUnauthorizedEmailError ? (
            <p className="mb-4 rounded-xl border border-[#E2B4B4] bg-[#FFF5F5] px-4 py-3 text-sm text-[#8A1C1C]">
              {UNAUTHORIZED_EMAIL_MESSAGE}
            </p>
          ) : null}
          <LoginForm />
        </div>
      </section>

      <section className="relative hidden min-h-screen overflow-hidden bg-[#0D1A4D] lg:block">
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
        >
          <source src="/backvideo.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,64,175,0.08)_0%,rgba(37,99,235,0.18)_50%,rgba(15,23,42,0.2)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(125,211,252,0.72),transparent_32%),radial-gradient(circle_at_78%_14%,rgba(59,130,246,0.36),transparent_28%),radial-gradient(circle_at_16%_68%,rgba(103,232,249,0.34),transparent_22%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_48%,rgba(147,197,253,0.12)_100%)]" />

        <div className="pointer-events-none absolute right-[-18px] bottom-[-40px] z-10 h-[592px] w-[592px]">
          <Image
            alt="Abstract ribbon sculpture"
            className="object-contain object-bottom-right"
            fill
            priority
            sizes="40vw"
            src={r55Image}
          />
        </div>
      </section>
    </main>
  );
}
