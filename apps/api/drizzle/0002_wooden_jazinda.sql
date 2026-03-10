PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_employees` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`name_eng` text NOT NULL,
	`role` text NOT NULL,
	`department` text NOT NULL,
	`responsibility_level` integer NOT NULL,
	`employment_status` text DEFAULT 'active' NOT NULL,
	`hire_date` text NOT NULL,
	`okr_submitted` integer DEFAULT false NOT NULL,
	`late_arrival_count` integer DEFAULT 0 NOT NULL,
	`late_arrival_updated_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_employees`("id", "email", "name", "name_eng", "role", "department", "responsibility_level", "employment_status", "hire_date", "okr_submitted", "late_arrival_count", "late_arrival_updated_at", "created_at", "updated_at") SELECT "id", "email", "name", "name_eng", "role", "department", "responsibility_level", "employment_status", "hire_date", "okr_submitted", "late_arrival_count", "late_arrival_updated_at", "created_at", "updated_at" FROM `employees`;--> statement-breakpoint
DROP TABLE `employees`;--> statement-breakpoint
ALTER TABLE `__new_employees` RENAME TO `employees`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `employees_email_unique` ON `employees` (`email`);--> statement-breakpoint
CREATE TABLE `__new_benefit_eligibility` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` text NOT NULL,
	`benefit_id` integer NOT NULL,
	`is_eligible` integer NOT NULL,
	`reason` text,
	`checked_at` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`benefit_id`) REFERENCES `benefits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_benefit_eligibility`("id", "employee_id", "benefit_id", "is_eligible", "reason", "checked_at") SELECT "id", "employee_id", "benefit_id", "is_eligible", "reason", "checked_at" FROM `benefit_eligibility`;--> statement-breakpoint
DROP TABLE `benefit_eligibility`;--> statement-breakpoint
ALTER TABLE `__new_benefit_eligibility` RENAME TO `benefit_eligibility`;--> statement-breakpoint
CREATE TABLE `__new_benefit_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` text NOT NULL,
	`benefit_id` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`requested_at` integer NOT NULL,
	`reviewed_by` integer,
	`reviewed_at` integer,
	`comment` text,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`benefit_id`) REFERENCES `benefits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_benefit_requests`("id", "employee_id", "benefit_id", "status", "requested_at", "reviewed_by", "reviewed_at", "comment") SELECT "id", "employee_id", "benefit_id", "status", "requested_at", "reviewed_by", "reviewed_at", "comment" FROM `benefit_requests`;--> statement-breakpoint
DROP TABLE `benefit_requests`;--> statement-breakpoint
ALTER TABLE `__new_benefit_requests` RENAME TO `benefit_requests`;--> statement-breakpoint
CREATE TABLE `__new_contracts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` text NOT NULL,
	`contract_type` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`base_salary` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_contracts`("id", "employee_id", "contract_type", "start_date", "end_date", "base_salary", "status", "created_at", "updated_at") SELECT "id", "employee_id", "contract_type", "start_date", "end_date", "base_salary", "status", "created_at", "updated_at" FROM `contracts`;--> statement-breakpoint
DROP TABLE `contracts`;--> statement-breakpoint
ALTER TABLE `__new_contracts` RENAME TO `contracts`;