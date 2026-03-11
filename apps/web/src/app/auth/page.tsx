import Link from "next/link";

export default function AuthPage() {
  return (
    <div>
      <Link href="/auth/login">Login</Link>
      {" | "}
      <Link href="/auth/sign-up">Sign Up</Link>
    </div>
  );
}
