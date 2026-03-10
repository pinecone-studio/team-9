PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_benefit_eligibility` (
	`employee_id` text NOT NULL,
	`benefit_id` text NOT NULL,
	`status` text NOT NULL,
	`rule_evaluation_json` text NOT NULL,
	`computed_at` text NOT NULL,
	`override_by` text,
	`override_reason` text,
	`override_expires_at` text,
	PRIMARY KEY(`employee_id`, `benefit_id`),
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`benefit_id`) REFERENCES `benefits`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`override_by`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_benefit_eligibility`("employee_id", "benefit_id", "status", "rule_evaluation_json", "computed_at", "override_by", "override_reason", "override_expires_at") SELECT "employee_id", "benefit_id", "status", "rule_evaluation_json", "computed_at", "override_by", "override_reason", "override_expires_at" FROM `benefit_eligibility`;--> statement-breakpoint
DROP TABLE `benefit_eligibility`;--> statement-breakpoint
ALTER TABLE `__new_benefit_eligibility` RENAME TO `benefit_eligibility`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_benefit_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`benefit_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`contract_version_accepted` text,
	`contract_accepted_at` text,
	`reviewed_by` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`benefit_id`) REFERENCES `benefits`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_by`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_benefit_requests`("id", "employee_id", "benefit_id", "status", "contract_version_accepted", "contract_accepted_at", "reviewed_by", "created_at", "updated_at") SELECT "id", "employee_id", "benefit_id", "status", "contract_version_accepted", "contract_accepted_at", "reviewed_by", "created_at", "updated_at" FROM `benefit_requests`;--> statement-breakpoint
DROP TABLE `benefit_requests`;--> statement-breakpoint
ALTER TABLE `__new_benefit_requests` RENAME TO `benefit_requests`;