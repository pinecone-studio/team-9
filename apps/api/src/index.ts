import { Hono } from 'hono';
import yoga from './graphql';

type Bindings = {
	DB: D1Database;
};

// type CreateEmployeeBody = {
// 	id: string;
// 	email: string;
// 	name: string;
// 	name_eng?: string;
// 	role: string;
// 	department?: string;
// 	responsibility_level?: number;
// 	employment_status: 'active' | 'probation' | 'leave' | 'terminated';
// 	hire_date: string;
// 	okr_submitted?: number;
// 	late_arrival_count?: number;
// 	late_arrival_updated_at?: string | null;
// 	employee_code?: string;
// };

const app = new Hono<{ Bindings: Bindings }>();

app.all('/graphql', (c) => {
	return yoga.fetch(c.req.raw, c.env, c.executionCtx);
});

export default app;
