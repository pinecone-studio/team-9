"use server";

import { getEmployeeRecordByEmail } from "@/shared/auth/get-employee-record-by-email";
import {
  EMAIL_LOOKUP_FAILURE_MESSAGE,
  UNAUTHORIZED_EMAIL_MESSAGE,
} from "./messages";

export async function verifyWorkEmailAccess(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Enter your work email.");
  }

  try {
    const employee = await getEmployeeRecordByEmail(normalizedEmail);

    if (!employee) {
      throw new Error(UNAUTHORIZED_EMAIL_MESSAGE);
    }

    return {
      normalizedEmail: employee.email.trim().toLowerCase(),
    };
  } catch (error) {
    if (error instanceof Error && error.message === UNAUTHORIZED_EMAIL_MESSAGE) {
      throw error;
    }

    throw new Error(EMAIL_LOOKUP_FAILURE_MESSAGE);
  }
}
