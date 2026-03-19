"use client";

import type { FormEvent } from "react";
import CodeStep from "./CodeStep";
import EmailStep from "./EmailStep";
import { useLoginFormFlow } from "./useLoginFormFlow";

export default function LoginForm() {
  const {
    code,
    emailAddress,
    errorMessage,
    isBusy,
    pendingEmailAddress,
    resendCode,
    resetToEmailStep,
    setCode,
    setEmailAddress,
    step,
    submitCode,
    submitEmail,
  } = useLoginFormFlow();

  return (
    <div className="w-full max-w-[380px]">
      {step === "email" ? (
        <EmailStep
          disabled={isBusy}
          emailAddress={emailAddress}
          errorMessage={errorMessage}
          onEmailChange={setEmailAddress}
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void submitEmail();
          }}
        />
      ) : (
        <CodeStep
          code={code}
          disabled={isBusy}
          errorMessage={errorMessage}
          onBack={resetToEmailStep}
          onCodeChange={setCode}
          onResend={() => void resendCode()}
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void submitCode();
          }}
          pendingEmailAddress={pendingEmailAddress}
        />
      )}

      <div aria-live="polite" className="pt-2">
        <div id="clerk-captcha" />
      </div>
    </div>
  );
}
