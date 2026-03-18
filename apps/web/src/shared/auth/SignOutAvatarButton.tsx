"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { SignOutConfirmDialog } from "@/shared/auth/SignOutConfirmDialog";

type SignOutAvatarButtonProps = {
  className: string;
  displayName?: string | null;
  openDialogLabel?: string;
  redirectUrl?: string;
};

function getInitials(value: string | null | undefined) {
  const parts = value
    ?.trim()
    .split(/[\s@._-]+/)
    .filter(Boolean);

  if (!parts?.length) {
    return "";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function SignOutAvatarButton({
  className,
  displayName,
  openDialogLabel = "Open sign out dialog",
  redirectUrl = "/auth/login",
}: SignOutAvatarButtonProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const initials =
    getInitials(
      displayName ?? user?.fullName ?? user?.primaryEmailAddress?.emailAddress,
    ) || "U";

  async function handleConfirmSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await signOut({ redirectUrl });
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <button
        aria-haspopup="dialog"
        aria-label={openDialogLabel}
        className={className}
        onClick={() => setIsDialogOpen(true)}
        type="button"
      >
        {initials}
      </button>

      <SignOutConfirmDialog
        isOpen={isDialogOpen}
        isSigningOut={isSigningOut}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={() => {
          void handleConfirmSignOut();
        }}
      />
    </>
  );
}
