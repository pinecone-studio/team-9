PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_eligibility_rules` (
	`id` text PRIMARY KEY NOT NULL,
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
INSERT INTO `__new_eligibility_rules`("id", "benefit_id", "rule_type", "operator", "value", "error_message", "priority", "is_active") SELECT "id", "benefit_id", "rule_type", "operator", "value", "error_message", "priority", "is_active" FROM `eligibility_rules`;--> statement-breakpoint
DROP TABLE `eligibility_rules`;--> statement-breakpoint
ALTER TABLE `__new_eligibility_rules` RENAME TO `eligibility_rules`;--> statement-breakpoint
PRAGMA foreign_keys=ON;