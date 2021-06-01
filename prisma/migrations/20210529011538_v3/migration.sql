-- CreateTable
CREATE TABLE `flagged_post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gif_id` INTEGER NOT NULL,
    `article_id` INTEGER NOT NULL,
    `flagged_by` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `flagged_post` ADD FOREIGN KEY (`gif_id`) REFERENCES `gifs`(`gif_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flagged_post` ADD FOREIGN KEY (`article_id`) REFERENCES `articles`(`article_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flagged_post` ADD FOREIGN KEY (`flagged_by`) REFERENCES `workers`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
