PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_benefits` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`subsidy_percent` integer NOT NULL,
	`vendor_name` text,
	`requires_contract` integer DEFAULT false NOT NULL,
	`active_contract_id` integer,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`active_contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_benefits`("id", "name", "category", "subsidy_percent", "vendor_name", "requires_contract", "active_contract_id", "is_active") SELECT "id", "name", "category", "subsidy_percent", "vendor_name", "requires_contract", "active_contract_id", "is_active" FROM `benefits`;--> statement-breakpoint
DROP TABLE `benefits`;--> statement-breakpoint
ALTER TABLE `__new_benefits` RENAME TO `benefits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;