"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

type UnauthorizedSessionResetProps = {
  redirectUrl: string;
};

export default function UnauthorizedSessionReset({
  redirectUrl,
}: UnauthorizedSessionResetProps) {
  const { signOut } = useClerk();

  useEffect(() => {
    void signOut({
      redirectUrl,
    });
  }, [redirectUrl, signOut]);

  return (
    <p className="mb-4 rounded-xl border border-[#E2B4B4] bg-[#FFF5F5] px-4 py-3 text-sm text-[#8A1C1C]">
      Your current session is being cleared because this email is not allowed.
    </p>
  );
}
