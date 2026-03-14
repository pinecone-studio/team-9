import { redirect } from "next/navigation";
import { getDefaultAppPath } from "@/shared/auth/get-current-user-access";

export default async function SignUpPage() {
  redirect(await getDefaultAppPath());
}
