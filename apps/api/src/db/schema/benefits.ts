import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { contracts } from './contracts';

export const benefits = sqliteTable('benefits', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	category: text('category'),
	subsidyPercent: integer('subsidy_percent').notNull().default(0),
	vendorName: text('vendor_name'),
	requiresContract: integer('requires_contract', { mode: 'boolean' }).notNull().default(false),
	activeContractId: integer('active_contract_id').references(() => contracts.id),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});
