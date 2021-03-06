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
    `resetPasswordToken` VARCHAR(191),
    `resetPasswordExpirationDate` VARCHAR(191),

    UNIQUE INDEX `users.email_unique`(`email`),
    UNIQUE INDEX `users.resetPasswordToken_unique`(`resetPasswordToken`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gifs` (
    `gif_id` INTEGER NOT NULL AUTO_INCREMENT,
    `gif_file_path` VARCHAR(191) NOT NULL,
    `category` ENUM('work_related', 'tech_related', 'world_related') NOT NULL,
    `flag` ENUM('inappropriate', 'appropriate') NOT NULL,
    `posted_by` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `gifs.gif_file_path_unique`(`gif_file_path`),
    PRIMARY KEY (`gif_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `article_id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_title` VARCHAR(191) NOT NULL,
    `article_content` LONGTEXT NOT NULL,
    `category` ENUM('work_related', 'tech_related', 'world_related') NOT NULL,
    `flag` ENUM('inappropriate', 'appropriate') NOT NULL,
    `posted_by` VARCHAR(191) NOT NULL,
    `uploaded` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`article_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles_comments` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `comment_content` TEXT NOT NULL,
    `posted_by` VARCHAR(191) NOT NULL,
    `article_id` INTEGER NOT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gifs_comments` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `comment_content` TEXT NOT NULL,
    `posted_by` VARCHAR(191) NOT NULL,
    `gif_id` INTEGER NOT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flagged_post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gif_id` INTEGER NOT NULL,
    `article_id` INTEGER NOT NULL,
    `flagged_by` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles` ADD FOREIGN KEY (`posted_by`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles_comments` ADD FOREIGN KEY (`posted_by`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles_comments` ADD FOREIGN KEY (`article_id`) REFERENCES `articles`(`article_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gifs` ADD FOREIGN KEY (`posted_by`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gifs_comments` ADD FOREIGN KEY (`posted_by`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gifs_comments` ADD FOREIGN KEY (`gif_id`) REFERENCES `gifs`(`gif_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flagged_post` ADD FOREIGN KEY (`gif_id`) REFERENCES `gifs`(`gif_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flagged_post` ADD FOREIGN KEY (`article_id`) REFERENCES `articles`(`article_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flagged_post` ADD FOREIGN KEY (`flagged_by`) REFERENCES `users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
