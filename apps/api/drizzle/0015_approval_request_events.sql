CREATE TABLE `approval_request_events` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `approval_request_id` text NOT NULL,
  `actor_identifier` text,
  `actor_type` text NOT NULL,
  `created_at` text NOT NULL,
  `label` text NOT NULL,
  `review_comment` text
);
