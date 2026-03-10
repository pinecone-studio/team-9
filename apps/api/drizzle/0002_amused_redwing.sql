ALTER TABLE `benefits` ADD `subsidy_percent` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `benefits` ADD `vendor_name` text;--> statement-breakpoint
ALTER TABLE `benefits` ADD `requires_contract` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `benefits` ADD `active_contract_id` integer REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action;
