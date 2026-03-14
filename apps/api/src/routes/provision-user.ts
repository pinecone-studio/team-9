import type { Context } from 'hono';
import { getEmployeeByEmail } from '../graphql/resolvers/queries/get-employee-by-email';

type ProvisionUserBindings = {
	DB: D1Database;
	CLERK_SECRET_KEY?: string;
};

type ProvisionUserRequest = {
	email?: string;
};

type ClerkListUsersResponse = {
	data?: Array<{
		email_addresses?: Array<{
			email_address?: string;
		}>;
	}>;
	errors?: Array<{
		long_message?: string;
		message?: string;
	}>;
};

type ClerkErrorResponse = {
	errors?: Array<{
		long_message?: string;
		message?: string;
	}>;
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
		lastName: parts.slice(1).join(' '),
	};
}

async function getClerkErrorMessage(response: Response, fallbackMessage: string) {
	const payload = (await response.json().catch(() => null)) as ClerkErrorResponse | null;
	return payload?.errors?.[0]?.long_message ?? payload?.errors?.[0]?.message ?? fallbackMessage;
}

async function findClerkUserByEmail(secretKey: string, email: string) {
	const url = new URL('https://api.clerk.com/v1/users');
	url.searchParams.set('limit', '10');
	url.searchParams.set('query', email);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${secretKey}`,
		},
	});

	if (!response.ok) {
		const message = await getClerkErrorMessage(
			response,
			`Failed to list Clerk users (${response.status}).`,
		);
		throw new Error(message);
	}

	const payload = (await response.json()) as ClerkListUsersResponse;

	return (
		payload.data?.find((user) =>
			user.email_addresses?.some(
				(emailAddress) => emailAddress.email_address?.trim().toLowerCase() === email,
			),
		) ?? null
	);
}

async function createClerkUser(
	secretKey: string,
	email: string,
	employee: Awaited<ReturnType<typeof getEmployeeByEmail>>,
) {
	const { firstName, lastName } = splitName(employee?.name ?? '');
	const response = await fetch('https://api.clerk.com/v1/users', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${secretKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email_address: [email],
			first_name: firstName,
			last_name: lastName,
			skip_legal_checks: true,
			skip_password_requirement: true,
			unsafe_metadata: {
				employeeId: employee?.id,
				role: employee?.position,
			},
		}),
	});

	if (response.ok) {
		return 'created' as const;
	}

	const message = await getClerkErrorMessage(
		response,
		`Failed to create Clerk user (${response.status}).`,
	);

	if (
		response.status === 422 &&
		/already exists|already been taken|has already been taken/i.test(message)
	) {
		return 'exists' as const;
	}

	throw new Error(message);
}

export async function handleProvisionUser(
	c: Context<{
		Bindings: ProvisionUserBindings;
	}>,
) {
	try {
		const { email } = (await c.req.json()) as ProvisionUserRequest;
		const normalizedEmail = email ? normalizeEmail(email) : '';

		if (!normalizedEmail) {
			return c.json({ error: 'Email is required.' }, 400);
		}

		const employee = await getEmployeeByEmail(c.env.DB, normalizedEmail);
		if (!employee) {
			return c.json({ error: 'This email is not in the employees table.' }, 404);
		}

		const secretKey = c.env.CLERK_SECRET_KEY?.trim();
		if (!secretKey) {
			return c.json({ error: 'Missing CLERK_SECRET_KEY.' }, 500);
		}

		const existingUser = await findClerkUserByEmail(secretKey, normalizedEmail);
		if (existingUser) {
			return c.json({
				created: false,
				employeeExists: true,
				userExists: true,
			});
		}

		const outcome = await createClerkUser(secretKey, normalizedEmail, employee);

		return c.json({
			created: outcome === 'created',
			employeeExists: true,
			userExists: outcome === 'exists',
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "We couldn't prepare your account.";

		return c.json({ error: message }, 500);
	}
}
