ALTER TABLE `benefits` ADD COLUMN `is_core` integer DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE `benefits` ADD COLUMN `approval_role` text DEFAULT 'hr_admin' NOT NULL;
--> statement-breakpoint
UPDATE `benefits`
SET `approval_role` = CASE
  WHEN lower(`name`) LIKE '%down payment%' THEN 'finance_manager'
  WHEN lower(`name`) LIKE '%bonus%' THEN 'finance_manager'
  ELSE 'hr_admin'
END
WHERE `approval_role` IS NULL OR `approval_role` = 'hr_admin';
--> statement-breakpoint
CREATE TABLE `approval_requests` (
  `id` text PRIMARY KEY NOT NULL,
  `entity_type` text NOT NULL,
  `entity_id` text,
  `action_type` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `target_role` text NOT NULL,
  `requested_by` text NOT NULL,
  `reviewed_by` text,
  `review_comment` text,
  `payload_json` text NOT NULL,
  `snapshot_json` text,
  `created_at` text NOT NULL,
  `reviewed_at` text,
  `is_active` integer DEFAULT true NOT NULL
);
