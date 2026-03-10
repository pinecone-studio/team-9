PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_contracts` (
	`id` text PRIMARY KEY NOT NULL,
	`benefit_id` text NOT NULL,
	`vendor_name` text NOT NULL,
	`version` text NOT NULL,
	`r2_object_key` text NOT NULL,
	`sha256_hash` text NOT NULL,
	`effective_date` text NOT NULL,
	`expiry_date` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`benefit_id`) REFERENCES `benefits`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_contracts`("id", "benefit_id", "vendor_name", "version", "r2_object_key", "sha256_hash", "effective_date", "expiry_date", "is_active") SELECT "id", "benefit_id", "vendor_name", "version", "r2_object_key", "sha256_hash", "effective_date", "expiry_date", "is_active" FROM `contracts`;--> statement-breakpoint
DROP TABLE `contracts`;--> statement-breakpoint
ALTER TABLE `__new_contracts` RENAME TO `contracts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_benefits` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`subsidy_percent` integer NOT NULL,
	`vendor_name` text,
	`requires_contract` integer DEFAULT false NOT NULL,
	`active_contract_id` text,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_benefits`("id", "name", "category", "subsidy_percent", "vendor_name", "requires_contract", "active_contract_id", "is_active") SELECT "id", "name", "category", "subsidy_percent", "vendor_name", "requires_contract", "active_contract_id", "is_active" FROM `benefits`;--> statement-breakpoint
DROP TABLE `benefits`;--> statement-breakpoint
ALTER TABLE `__new_benefits` RENAME TO `benefits`;