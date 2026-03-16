ALTER TABLE `rules` ADD COLUMN `default_value` text;
--> statement-breakpoint
UPDATE `rules`
SET `default_value` = (
	SELECT br.`value`
	FROM `benefit_rules` br
	WHERE br.`rule_id` = `rules`.`id`
	ORDER BY br.`priority` ASC, br.`id` ASC
	LIMIT 1
)
WHERE `default_value` IS NULL;
