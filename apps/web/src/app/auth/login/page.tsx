import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getDefaultAppPath } from "@/shared/auth/get-current-user-access";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const { userId } = await auth();

  if (userId) {
    redirect(await getDefaultAppPath());
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
