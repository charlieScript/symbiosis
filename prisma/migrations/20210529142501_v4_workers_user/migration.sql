/*
  Warnings:

  - You are about to drop the `workers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `articles_comments` DROP FOREIGN KEY `articles_comments_ibfk_1`;

-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_ibfk_1`;

-- DropForeignKey
ALTER TABLE `gifs_comments` DROP FOREIGN KEY `gifs_comments_ibfk_1`;

-- DropForeignKey
ALTER TABLE `gifs` DROP FOREIGN KEY `gifs_ibfk_1`;

-- DropForeignKey
ALTER TABLE `flagged_post` DROP FOREIGN KEY `flagged_post_ibfk_3`;

-- DropTable
DROP TABLE `workers`;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'employee') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users.email_unique`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles_comments` ADD FOREIGN KEY (`posted_by`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD FOREIGN KEY (`posted_by`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gifs_comments` ADD FOREIGN KEY (`posted_by`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gifs` ADD FOREIGN KEY (`posted_by`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flagged_post` ADD FOREIGN KEY (`flagged_by`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
