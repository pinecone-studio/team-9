PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_benefit_eligibility` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` text NOT NULL,
	`benefit_id` text NOT NULL,
	`is_eligible` integer NOT NULL,
	`reason` text,
	`checked_at` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`benefit_id`) REFERENCES `benefits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_benefit_eligibility`("id", "employee_id", "benefit_id", "is_eligible", "reason", "checked_at")
SELECT "id", "employee_id", CAST("benefit_id" AS text), "is_eligible", "reason", "checked_at" FROM `benefit_eligibility`;--> statement-breakpoint
DROP TABLE `benefit_eligibility`;--> statement-breakpoint
ALTER TABLE `__new_benefit_eligibility` RENAME TO `benefit_eligibility`;--> statement-breakpoint
CREATE TABLE `__new_benefit_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` text NOT NULL,
	`benefit_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`requested_at` integer NOT NULL,
	`reviewed_by` integer,
	`reviewed_at` integer,
	`comment` text,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`benefit_id`) REFERENCES `benefits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_benefit_requests`("id", "employee_id", "benefit_id", "status", "requested_at", "reviewed_by", "reviewed_at", "comment")
SELECT "id", "employee_id", CAST("benefit_id" AS text), "status", "requested_at", "reviewed_by", "reviewed_at", "comment" FROM `benefit_requests`;--> statement-breakpoint
DROP TABLE `benefit_requests`;--> statement-breakpoint
ALTER TABLE `__new_benefit_requests` RENAME TO `benefit_requests`;--> statement-breakpoint
CREATE TABLE `__new_eligibility_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`benefit_id` text NOT NULL,
	`rule_type` text NOT NULL,
	`operator` text NOT NULL,
	`value` text NOT NULL,
	`error_message` text NOT NULL,
	`priority` integer DEFAULT 1 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`benefit_id`) REFERENCES `benefits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_eligibility_rules`("id", "benefit_id", "rule_type", "operator", "value", "error_message", "priority", "is_active")
SELECT "id", CAST("benefit_id" AS text), "rule_type", "operator", "value", "error_message", "priority", "is_active" FROM `eligibility_rules`;--> statement-breakpoint
DROP TABLE `eligibility_rules`;--> statement-breakpoint
ALTER TABLE `__new_eligibility_rules` RENAME TO `eligibility_rules`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
