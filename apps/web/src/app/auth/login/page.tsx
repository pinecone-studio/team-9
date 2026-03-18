import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getDefaultAppPath } from "@/shared/auth/get-current-user-access";
import LoginForm from "./LoginForm";
import {
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
  const hasUnauthorizedEmailError = errorParam === UNAUTHORIZED_EMAIL_QUERY;

  if (userId) {
    const appPath = await getDefaultAppPath();

    if (appPath !== `/auth/login?error=${UNAUTHORIZED_EMAIL_QUERY}`) {
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

          {userId ? (
            <UnauthorizedSessionReset
              redirectUrl={`/auth/login?error=${UNAUTHORIZED_EMAIL_QUERY}`}
            />
          ) : null}
          {hasUnauthorizedEmailError ? (
            <p className="mb-4 rounded-xl border border-[#E2B4B4] bg-[#FFF5F5] px-4 py-3 text-sm text-[#8A1C1C]">
              {UNAUTHORIZED_EMAIL_MESSAGE}
            </p>
          ) : null}
          <LoginForm />
        </div>
      </section>

      <section className="relative hidden min-h-screen overflow-hidden bg-black lg:block">
        <Image
          alt="Abstract login illustration"
          className="object-contain object-right-bottom"
          fill
          priority
          sizes="50vw"
          src="/auth/login-visual.png"
        />
      </section>
    </main>
  );
}
