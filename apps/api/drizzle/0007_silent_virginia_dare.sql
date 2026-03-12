CREATE TABLE `benefit_categories` (
        `id` text PRIMARY KEY NOT NULL,
        `name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `benefit_categories_name_unique` ON `benefit_categories` (`name`);
--> statement-breakpoint
INSERT INTO `benefit_categories` (`id`, `name`)
SELECT lower(hex(randomblob(16))), `category`
FROM (
        SELECT DISTINCT `category`
        FROM `benefits`
)
WHERE `category` IS NOT NULL;
--> statement-breakpoint
ALTER TABLE `benefits` ADD COLUMN `category_id` text;
--> statement-breakpoint
UPDATE `benefits`
SET `category_id` = (
        SELECT bc.`id`
        FROM `benefit_categories` bc
        WHERE bc.`name` = `benefits`.`category`
);
