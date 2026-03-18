"use server";

import { getEmployeeRecordByEmail } from "@/shared/auth/get-employee-record-by-email";
import {
  EMAIL_LOOKUP_FAILURE_MESSAGE,
  UNAUTHORIZED_EMAIL_MESSAGE,
} from "./messages";

type VerifyWorkEmailAccessResult =
  | {
      normalizedEmail: string;
      ok: true;
    }
  | {
      message: string;
      ok: false;
    };

export async function verifyWorkEmailAccess(
  email: string,
): Promise<VerifyWorkEmailAccessResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      message: "Enter your work email.",
      ok: false,
    };
  }

  try {
    const employee = await getEmployeeRecordByEmail(normalizedEmail);

    if (!employee) {
      return {
        message: UNAUTHORIZED_EMAIL_MESSAGE,
        ok: false,
      };
    }

    return {
      normalizedEmail: employee.email.trim().toLowerCase(),
      ok: true,
    };
  } catch {
    return {
      message: EMAIL_LOOKUP_FAILURE_MESSAGE,
      ok: false,
    };
  }
}
