"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyWorkEmailAccess } from "./actions";
import getErrorMessage from "./getErrorMessage";
import { finalizeAuthFlow, startEmailCodeFlow } from "./login-flow-helpers";

type AuthFlow = "signIn" | "signUp";
type Step = "email" | "code";

export function useLoginFormFlow() {
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

  const submitEmail = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const accessResult = await verifyWorkEmailAccess(emailAddress);
      if (!accessResult.ok) {
        setErrorMessage(accessResult.message);
        return;
      }

      const flow = await startEmailCodeFlow({
        normalizedEmail: accessResult.normalizedEmail,
        onFlowResolved: async (resolvedFlow) => {
          await finalizeAuthFlow({
            flow: resolvedFlow,
            navigateAfterAuth,
            signIn,
            signUp,
          });
        },
        signIn,
        signUp,
      });
      setAuthFlow(flow);
      setPendingEmailAddress(accessResult.normalizedEmail);
      setStep("code");
      setCode("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitCode = async () => {
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      setErrorMessage("Enter the verification code.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (authFlow === "signUp") {
        const result = await signUp.verifications.verifyEmailCode({ code: normalizedCode });
        if (result.error) throw result.error;
        if (signUp.status === "complete") {
          await finalizeAuthFlow({
            flow: "signUp",
            navigateAfterAuth,
            signIn,
            signUp,
          });
          return;
        }
      } else {
        const result = await signIn.emailCode.verifyCode({ code: normalizedCode });
        if (result.error) throw result.error;
        if (signIn.status === "complete") {
          await finalizeAuthFlow({
            flow: "signIn",
            navigateAfterAuth,
            signIn,
            signUp,
          });
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

  const resendCode = async () => {
    if (!pendingEmailAddress) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (authFlow === "signUp") {
        const result = await signUp.verifications.sendEmailCode();
        if (result.error) throw result.error;
      } else {
        const result = await signIn.emailCode.sendCode();
        if (result.error) throw result.error;
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    code,
    emailAddress,
    errorMessage,
    isBusy: isSubmitting || isLoadingResources,
    pendingEmailAddress,
    setCode,
    setEmailAddress,
    step,
    submitCode,
    submitEmail,
    resendCode,
    resetToEmailStep: () => {
      setAuthFlow("signIn");
      setStep("email");
      setCode("");
      setErrorMessage(null);
    },
  };
}
