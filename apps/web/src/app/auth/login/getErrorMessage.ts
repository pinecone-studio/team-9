import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export default function getErrorMessage(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return (
      error.errors[0]?.longMessage ??
      error.errors[0]?.message ??
      "We couldn't continue with this email."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "We couldn't continue with this email.";
}
