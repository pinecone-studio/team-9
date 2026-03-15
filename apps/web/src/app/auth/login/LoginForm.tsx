/* eslint-disable max-lines */
"use client";

import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import CodeStep from "./CodeStep";
import EmailStep from "./EmailStep";
import getErrorMessage from "./getErrorMessage";

type AuthFlow = "signIn" | "signUp";
type Step = "email" | "code";

function throwIfClerkResultHasError(result: { error: unknown | null }) {
  if (result.error) {
    throw result.error;
  }
}

function isIdentifierNotFoundError(error: unknown) {
  return (
    isClerkAPIResponseError(error) &&
    error.errors.some((issue) => issue.code === "form_identifier_not_found")
  );
}

export default function LoginForm() {
  const router = useRouter();
  const { fetchStatus: signInFetchStatus, signIn } = useSignIn();
  const { fetchStatus: signUpFetchStatus, signUp } = useSignUp();

  const [step, setStep] = useState<Step>("email");
  const [authFlow, setAuthFlow] = useState<AuthFlow>("signIn");
  const [emailAddress, setEmailAddress] = useState("");
  const [pendingEmailAddress, setPendingEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoadingResources =
    signInFetchStatus === "fetching" || signUpFetchStatus === "fetching";

  const navigateAfterAuth = async ({
    decorateUrl,
    session,
  }: {
    decorateUrl: (url: string) => string;
    session: { currentTask?: unknown };
  }) => {
    if (session?.currentTask) {
      return;
    }

    const url = decorateUrl("/");

    if (url.startsWith("http")) {
      window.location.href = url;
      return;
    }

    router.push(url);
  };

  const finalizeAuth = async (flow: AuthFlow) => {
    if (flow === "signIn") {
      throwIfClerkResultHasError(
        await signIn.finalize({
          navigate: navigateAfterAuth,
        }),
      );
      return;
    }

    throwIfClerkResultHasError(
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          return navigateAfterAuth({ decorateUrl, session });
        },
      }),
    );
  };

  const startSignInCodeFlow = async (normalizedEmail: string) => {
    throwIfClerkResultHasError(
      await signIn.create({
        identifier: normalizedEmail,
      }),
    );
    throwIfClerkResultHasError(await signIn.emailCode.sendCode());

    if (signIn.status === "complete") {
      await finalizeAuth("signIn");
      return;
    }

    setAuthFlow("signIn");
  };

  const startSignUpCodeFlow = async (normalizedEmail: string) => {
    throwIfClerkResultHasError(
      await signUp.create({
        emailAddress: normalizedEmail,
      }),
    );
    throwIfClerkResultHasError(await signUp.verifications.sendEmailCode());

    if (signUp.status === "complete") {
      await finalizeAuth("signUp");
      return;
    }

    setAuthFlow("signUp");
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = emailAddress.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Enter your work email.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      try {
        await startSignInCodeFlow(normalizedEmail);
      } catch (error) {
        if (!isIdentifierNotFoundError(error)) {
          throw error;
        }

        await startSignUpCodeFlow(normalizedEmail);
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

    const normalizedCode = code.trim();

    if (!normalizedCode) {
      setErrorMessage("Enter the verification code.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (authFlow === "signUp") {
        throwIfClerkResultHasError(
          await signUp.verifications.verifyEmailCode({
            code: normalizedCode,
          }),
        );

        if (signUp.status === "complete") {
          await finalizeAuth("signUp");
          return;
        }
      } else {
        throwIfClerkResultHasError(
          await signIn.emailCode.verifyCode({
            code: normalizedCode,
          }),
        );

        if (signIn.status === "complete") {
          await finalizeAuth("signIn");
          return;
        }
      }

      setErrorMessage("The verification code is invalid or expired.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!pendingEmailAddress) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (authFlow === "signUp") {
        throwIfClerkResultHasError(await signUp.verifications.sendEmailCode());
      } else {
        throwIfClerkResultHasError(await signIn.emailCode.sendCode());
      }
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
          disabled={isSubmitting || isLoadingResources}
          emailAddress={emailAddress}
          errorMessage={errorMessage}
          onEmailChange={setEmailAddress}
          onSubmit={handleEmailSubmit}
        />
      ) : (
        <CodeStep
          code={code}
          disabled={isSubmitting || isLoadingResources}
          errorMessage={errorMessage}
          onBack={() => {
            setAuthFlow("signIn");
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

      <div aria-live="polite" className="pt-2">
        <div id="clerk-captcha" />
      </div>
    </div>
  );
}
