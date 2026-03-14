import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { getEmployeeRecordByEmail } from "@/shared/auth/get-employee-record-by-email";

type ProvisionUserRequest = {
  email?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function splitName(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return {};
  }

  if (parts.length === 1) {
    return { firstName: parts[0] };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as ProvisionUserRequest;
    const normalizedEmail = email ? normalizeEmail(email) : "";

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const employee = await getEmployeeRecordByEmail(normalizedEmail);

    if (!employee) {
      return NextResponse.json(
        {
          error: "This email is not in the employees table.",
        },
        { status: 404 },
      );
    }

    const client = await clerkClient();
    const existingUsers = await client.users.getUserList({
      emailAddress: [normalizedEmail],
      limit: 1,
    });

    if (existingUsers.data.length > 0) {
      return NextResponse.json({
        created: false,
        employeeExists: true,
        userExists: true,
      });
    }

    const { firstName, lastName } = splitName(employee.name);

    await client.users.createUser({
      emailAddress: [normalizedEmail],
      firstName,
      lastName,
      skipLegalChecks: true,
      skipPasswordRequirement: true,
      unsafeMetadata: {
        employeeId: employee.id,
        role: employee.position,
      },
    });

    return NextResponse.json({
      created: true,
      employeeExists: true,
      userExists: false,
    });
  } catch (error) {
    const rawMessage =
      error instanceof Error ? error.message : "We couldn't prepare your account.";
    const message = rawMessage.includes("(403)")
      ? "Start the API backend at http://localhost:8787/graphql. The current Cloudflare token cannot query D1 directly."
      : rawMessage;

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    );
  }
}
