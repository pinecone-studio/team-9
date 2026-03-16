UPDATE `benefit_rules`
SET `rule_id` = (
  SELECT MIN(r2.`id`)
  FROM `rules` r1
  INNER JOIN `rules` r2
    ON r2.`category_id` = r1.`category_id`
   AND r2.`name` = r1.`name`
  WHERE r1.`id` = `benefit_rules`.`rule_id`
)
WHERE EXISTS (
  SELECT 1
  FROM `rules` r1
  INNER JOIN `rules` r2
    ON r2.`category_id` = r1.`category_id`
   AND r2.`name` = r1.`name`
  WHERE r1.`id` = `benefit_rules`.`rule_id`
    AND r2.`id` <> `benefit_rules`.`rule_id`
);
--> statement-breakpoint
DELETE FROM `benefit_rules`
WHERE `id` NOT IN (
  SELECT MIN(`id`)
  FROM `benefit_rules`
  GROUP BY
    `benefit_id`,
    `rule_id`,
    `operator`,
    `value`,
    `error_message`,
    `priority`,
    `is_active`
);
--> statement-breakpoint
DELETE FROM `rules`
WHERE `id` NOT IN (
  SELECT MIN(`id`)
  FROM `rules`
  GROUP BY `category_id`, `name`
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `rules_category_name_unique`
ON `rules` (`category_id`, `name`);
