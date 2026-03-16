CREATE TABLE `rule_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rule_categories_name_unique` ON `rule_categories` (`name`);
--> statement-breakpoint
CREATE TABLE `rules` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`rule_type` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`value_type` text NOT NULL,
	`allowed_operators` text DEFAULT '[]' NOT NULL,
	`options_json` text,
	`default_unit` text,
	`default_operator` text DEFAULT 'eq' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `rule_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `benefit_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`benefit_id` text NOT NULL,
	`rule_id` text NOT NULL,
	`operator` text NOT NULL,
	`value` text NOT NULL,
	`error_message` text NOT NULL,
	`priority` integer DEFAULT 1 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`benefit_id`) REFERENCES `benefits`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rule_id`) REFERENCES `rules`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `rule_categories` (`id`, `name`, `description`) VALUES
	('cat_gate_rules', 'Gate Rules', 'Access gating rules'),
	('cat_threshold_rules', 'Threshold Rules', 'Threshold based checks'),
	('cat_tenure_rules', 'Tenure Rules', 'Employment duration checks'),
	('cat_level_rules', 'Level Rules', 'Responsibility level checks');
