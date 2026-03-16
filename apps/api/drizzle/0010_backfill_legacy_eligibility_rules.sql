INSERT OR IGNORE INTO `rule_categories` (`id`, `name`, `description`) VALUES
	('cat_gate_rules', 'Gate Rules', 'Access gating rules'),
	('cat_threshold_rules', 'Threshold Rules', 'Threshold based checks'),
	('cat_tenure_rules', 'Tenure Rules', 'Employment duration checks'),
	('cat_level_rules', 'Level Rules', 'Responsibility level checks');
--> statement-breakpoint
INSERT OR IGNORE INTO `rules` (
	`id`,
	`category_id`,
	`rule_type`,
	`name`,
	`description`,
	`value_type`,
	`allowed_operators`,
	`options_json`,
	`default_unit`,
	`default_operator`,
	`is_active`
)
SELECT
	'legacy_' || er.`id` AS `id`,
	CASE
		WHEN er.`rule_type` IN ('employment_status', 'okr_submitted') THEN 'cat_gate_rules'
		WHEN er.`rule_type` = 'tenure_days' THEN 'cat_tenure_rules'
		WHEN er.`rule_type` = 'responsibility_level' THEN 'cat_level_rules'
		ELSE 'cat_threshold_rules'
	END AS `category_id`,
	er.`rule_type`,
	CASE er.`rule_type`
		WHEN 'employment_status' THEN 'Employment Status Rule'
		WHEN 'okr_submitted' THEN 'OKR Submitted Rule'
		WHEN 'attendance' THEN 'Attendance Rule'
		WHEN 'responsibility_level' THEN 'Responsibility Level Rule'
		WHEN 'role' THEN 'Role Rule'
		WHEN 'tenure_days' THEN 'Tenure Rule'
		ELSE 'Legacy Rule'
	END AS `name`,
	COALESCE(NULLIF(er.`error_message`, ''), 'Legacy rule migrated from eligibility_rules') AS `description`,
	CASE
		WHEN er.`rule_type` = 'okr_submitted' THEN 'boolean'
		WHEN er.`rule_type` IN ('employment_status', 'role') THEN 'enum'
		ELSE 'number'
	END AS `value_type`,
	CASE
		WHEN er.`rule_type` = 'okr_submitted' THEN '["eq","neq"]'
		WHEN er.`rule_type` IN ('employment_status', 'role') THEN '["eq","neq","in","not_in"]'
		ELSE '["eq","neq","gt","gte","lt","lte"]'
	END AS `allowed_operators`,
	CASE
		WHEN er.`rule_type` = 'employment_status' THEN '["active","probation","leave","terminated"]'
		WHEN er.`rule_type` = 'okr_submitted' THEN '[true,false]'
		ELSE NULL
	END AS `options_json`,
	CASE
		WHEN er.`rule_type` = 'tenure_days' THEN 'days'
		WHEN er.`rule_type` = 'attendance' THEN 'times'
		WHEN er.`rule_type` = 'responsibility_level' THEN 'level'
		ELSE NULL
	END AS `default_unit`,
	er.`operator` AS `default_operator`,
	er.`is_active` AS `is_active`
FROM `eligibility_rules` er;
--> statement-breakpoint
INSERT OR IGNORE INTO `benefit_rules` (
	`id`,
	`benefit_id`,
	`rule_id`,
	`operator`,
	`value`,
	`error_message`,
	`priority`,
	`is_active`
)
SELECT
	er.`id`,
	er.`benefit_id`,
	'legacy_' || er.`id` AS `rule_id`,
	er.`operator`,
	er.`value`,
	er.`error_message`,
	er.`priority`,
	er.`is_active`
FROM `eligibility_rules` er;
