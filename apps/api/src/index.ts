import { Hono } from 'hono';

type Bindings = {
	DB: D1Database;
};

type CreateEmployeeBody = {
	id: string;
	email: string;
	name: string;
	name_eng?: string;
	role: string;
	department?: string;
	responsibility_level?: number;
	employment_status: 'active' | 'probation' | 'leave' | 'terminated';
	hire_date: string;
	okr_submitted?: number;
	late_arrival_count?: number;
	late_arrival_updated_at?: string | null;
	employee_code?: string;
};

type UpdateEmployeeBody = Partial<CreateEmployeeBody>;

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => {
	return c.text('EBMS backend running test');
});

app.get('/employees', async (c) => {
	const { results } = await c.env.DB.prepare(`SELECT * FROM employees ORDER BY created_at DESC`).all();

	return c.json({
		success: true,
		data: results,
	});
});

app.get('/employees/:id', async (c) => {
	const id = c.req.param('id');

	const employee = await c.env.DB.prepare(`SELECT * FROM employees WHERE id = ?`).bind(id).first();

	if (!employee) {
		return c.json(
			{
				success: false,
				message: 'Employee not found',
			},
			404,
		);
	}

	return c.json({
		success: true,
		data: employee,
	});
});

app.post('/employees', async (c) => {
	try {
		const body = (await c.req.json()) as CreateEmployeeBody;

		if (!body.id || !body.email || !body.name || !body.role || !body.employment_status || !body.hire_date) {
			return c.json(
				{
					success: false,
					message: 'id, email, name, role, employment_status, hire_date шаардлагатай',
				},
				400,
			);
		}

		const responsibilityLevel = body.responsibility_level ?? 1;
		const okrSubmitted = body.okr_submitted ?? 0;
		const lateArrivalCount = body.late_arrival_count ?? 0;

		if (![1, 2, 3].includes(responsibilityLevel)) {
			return c.json(
				{
					success: false,
					message: 'responsibility_level 1, 2, 3-ын нэг байх ёстой',
				},
				400,
			);
		}

		if (!['active', 'probation', 'leave', 'terminated'].includes(body.employment_status)) {
			return c.json(
				{
					success: false,
					message: 'employment_status буруу байна',
				},
				400,
			);
		}

		await c.env.DB.prepare(
			`
      INSERT INTO employees (
        id,
        email,
        name,
        name_eng,
        role,
        department,
        responsibility_level,
        employment_status,
        hire_date,
        okr_submitted,
        late_arrival_count,
        late_arrival_updated_at,
        employee_code
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
		)
			.bind(
				body.id,
				body.email,
				body.name,
				body.name_eng ?? null,
				body.role,
				body.department ?? null,
				responsibilityLevel,
				body.employment_status,
				body.hire_date,
				okrSubmitted,
				lateArrivalCount,
				body.late_arrival_updated_at ?? null,
				body.employee_code ?? null,
			)
			.run();

		const createdEmployee = await c.env.DB.prepare(`SELECT * FROM employees WHERE id = ?`).bind(body.id).first();

		return c.json(
			{
				success: true,
				message: 'Employee created successfully',
				data: createdEmployee,
			},
			201,
		);
	} catch (error) {
		return c.json(
			{
				success: false,
				message: 'Create employee error',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			500,
		);
	}
});

app.put('/employees/:id', async (c) => {
	try {
		const id = c.req.param('id');
		const body = (await c.req.json()) as UpdateEmployeeBody;

		const existingEmployee = await c.env.DB.prepare(`SELECT * FROM employees WHERE id = ?`).bind(id).first();

		if (!existingEmployee) {
			return c.json(
				{
					success: false,
					message: 'Employee not found',
				},
				404,
			);
		}

		const responsibilityLevel = body.responsibility_level ?? (existingEmployee as any).responsibility_level;
		const employmentStatus = body.employment_status ?? (existingEmployee as any).employment_status;
		const okrSubmitted = body.okr_submitted ?? (existingEmployee as any).okr_submitted;
		const lateArrivalCount = body.late_arrival_count ?? (existingEmployee as any).late_arrival_count;

		if (![1, 2, 3].includes(Number(responsibilityLevel))) {
			return c.json(
				{
					success: false,
					message: 'responsibility_level 1, 2, 3-ын нэг байх ёстой',
				},
				400,
			);
		}

		if (!['active', 'probation', 'leave', 'terminated'].includes(String(employmentStatus))) {
			return c.json(
				{
					success: false,
					message: 'employment_status буруу байна',
				},
				400,
			);
		}

		await c.env.DB.prepare(
			`
      UPDATE employees
      SET
        email = ?,
        name = ?,
        name_eng = ?,
        role = ?,
        department = ?,
        responsibility_level = ?,
        employment_status = ?,
        hire_date = ?,
        okr_submitted = ?,
        late_arrival_count = ?,
        late_arrival_updated_at = ?,
        employee_code = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
		)
			.bind(
				body.email ?? (existingEmployee as any).email,
				body.name ?? (existingEmployee as any).name,
				body.name_eng ?? (existingEmployee as any).name_eng ?? null,
				body.role ?? (existingEmployee as any).role,
				body.department ?? (existingEmployee as any).department ?? null,
				responsibilityLevel,
				employmentStatus,
				body.hire_date ?? (existingEmployee as any).hire_date,
				okrSubmitted,
				lateArrivalCount,
				body.late_arrival_updated_at ?? (existingEmployee as any).late_arrival_updated_at ?? null,
				body.employee_code ?? (existingEmployee as any).employee_code ?? null,
				id,
			)
			.run();

		const updatedEmployee = await c.env.DB.prepare(`SELECT * FROM employees WHERE id = ?`).bind(id).first();

		return c.json({
			success: true,
			message: 'Employee updated successfully',
			data: updatedEmployee,
		});
	} catch (error) {
		return c.json(
			{
				success: false,
				message: 'Update employee error',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			500,
		);
	}
});

app.delete('/employees/:id', async (c) => {
	try {
		const id = c.req.param('id');

		const existingEmployee = await c.env.DB.prepare(`SELECT * FROM employees WHERE id = ?`).bind(id).first();

		if (!existingEmployee) {
			return c.json(
				{
					success: false,
					message: 'Employee not found',
				},
				404,
			);
		}

		await c.env.DB.prepare(`DELETE FROM employees WHERE id = ?`).bind(id).run();

		return c.json({
			success: true,
			message: 'Employee deleted successfully',
		});
	} catch (error) {
		return c.json(
			{
				success: false,
				message: 'Delete employee error',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			500,
		);
	}
});

export default app;
