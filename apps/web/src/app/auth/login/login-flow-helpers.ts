import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

type AuthFlow = "signIn" | "signUp";

type NavigationHandler = (params: {
  decorateUrl: (url: string) => string;
  session: { currentTask?: unknown };
}) => Promise<void>;

type SignInLike = {
  create: (params: { identifier: string }) => Promise<{ error?: unknown | null }>;
  emailCode: {
    sendCode: () => Promise<{ error?: unknown | null }>;
    verifyCode: (params: { code: string }) => Promise<{ error?: unknown | null }>;
  };
  finalize: (params: { navigate: NavigationHandler }) => Promise<{ error?: unknown | null }>;
  status: string;
};

type SignUpLike = {
  create: (params: { emailAddress: string }) => Promise<{ error?: unknown | null }>;
  verifications: {
    sendEmailCode: () => Promise<{ error?: unknown | null }>;
    verifyEmailCode: (params: { code: string }) => Promise<{ error?: unknown | null }>;
  };
  finalize: (params: {
    navigate: (params: {
      decorateUrl: (url: string) => string;
      session: { currentTask?: unknown };
    }) => Promise<void>;
  }) => Promise<{ error?: unknown | null }>;
  status: string;
};

export async function finalizeAuthFlow({
  flow,
  navigateAfterAuth,
  signIn,
  signUp,
}: {
  flow: AuthFlow;
  navigateAfterAuth: NavigationHandler;
  signIn: SignInLike;
  signUp: SignUpLike;
}) {
  throwIfClerkResultHasError(
    flow === "signIn"
      ? await signIn.finalize({ navigate: navigateAfterAuth })
      : await signUp.finalize({
          navigate: ({ session, decorateUrl }) => navigateAfterAuth({ decorateUrl, session }),
        }),
  );
}

export async function startEmailCodeFlow({
  normalizedEmail,
  onFlowResolved,
  signIn,
  signUp,
}: {
  normalizedEmail: string;
  onFlowResolved: (flow: AuthFlow) => Promise<void>;
  signIn: SignInLike;
  signUp: SignUpLike;
}) {
  try {
    throwIfClerkResultHasError(await signIn.create({ identifier: normalizedEmail }));
    throwIfClerkResultHasError(await signIn.emailCode.sendCode());
    if (signIn.status === "complete") {
      await onFlowResolved("signIn");
      return "signIn";
    }
    return "signIn";
  } catch (error) {
    if (!isIdentifierNotFoundError(error)) {
      throw error;
    }

    throwIfClerkResultHasError(await signUp.create({ emailAddress: normalizedEmail }));
    throwIfClerkResultHasError(await signUp.verifications.sendEmailCode());
    if (signUp.status === "complete") {
      await onFlowResolved("signUp");
      return "signUp";
    }
    return "signUp";
  }
}

function isIdentifierNotFoundError(error: unknown) {
  return (
    isClerkAPIResponseError(error) &&
    error.errors.some((issue) => issue.code === "form_identifier_not_found")
  );
}

function throwIfClerkResultHasError(result: { error?: unknown | null }) {
  if (result.error) {
    throw result.error;
  }
}
