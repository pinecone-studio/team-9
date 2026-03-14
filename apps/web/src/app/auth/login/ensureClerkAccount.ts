import getProvisionUserUrl from "./getProvisionUserUrl";

export default async function ensureClerkAccount(email: string) {
  const response = await fetch(getProvisionUserUrl(), {
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
}
