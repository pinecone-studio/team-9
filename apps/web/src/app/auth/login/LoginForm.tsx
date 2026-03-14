"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import CodeStep from "./CodeStep";
import EmailStep from "./EmailStep";
import getErrorMessage from "./getErrorMessage";

type Step = "email" | "code";

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useSignIn();

  const [step, setStep] = useState<Step>("email");
  const [emailAddress, setEmailAddress] = useState("");
  const [pendingEmailAddress, setPendingEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalizeSignIn = async () => {
    if (!signIn) {
      return;
    }

    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          return;
        }

        const url = decorateUrl("/");

        if (url.startsWith("http")) {
          window.location.href = url;
          return;
        }

        router.push(url);
      },
    });
  };

  const ensureClerkAccount = async (email: string) => {
    const response = await fetch("/api/auth/provision-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      throw new Error(payload?.error ?? "We couldn't prepare your account.");
    }
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!signIn) {
      return;
    }

    const normalizedEmail = emailAddress.trim();

    if (!normalizedEmail) {
      setErrorMessage("Enter your work email.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await ensureClerkAccount(normalizedEmail);

      const result = (await signIn.create({
        identifier: normalizedEmail,
      })) as { error?: unknown };

      if (result.error) {
        setErrorMessage(getErrorMessage(result.error));
        return;
      }

      await signIn.emailCode.sendCode({
        emailAddress: normalizedEmail,
      });

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      setPendingEmailAddress(normalizedEmail);
      setStep("code");
      setCode("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!signIn) {
      return;
    }

    const normalizedCode = code.trim();

    if (!normalizedCode) {
      setErrorMessage("Enter the verification code.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signIn.emailCode.verifyCode({
        code: normalizedCode,
      });

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      setErrorMessage("The verification code is invalid or expired.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!signIn || !pendingEmailAddress) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signIn.emailCode.sendCode({
        emailAddress: pendingEmailAddress,
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[380px]">
      {step === "email" ? (
        <EmailStep
          disabled={isSubmitting || !signIn}
          emailAddress={emailAddress}
          errorMessage={errorMessage}
          onEmailChange={setEmailAddress}
          onSubmit={handleEmailSubmit}
        />
      ) : (
        <CodeStep
          code={code}
          disabled={isSubmitting || !signIn}
          errorMessage={errorMessage}
          onBack={() => {
            setStep("email");
            setCode("");
            setErrorMessage(null);
          }}
          onCodeChange={setCode}
          onResend={handleResendCode}
          onSubmit={handleCodeSubmit}
          pendingEmailAddress={pendingEmailAddress}
        />
      )}
    </div>
  );
}
