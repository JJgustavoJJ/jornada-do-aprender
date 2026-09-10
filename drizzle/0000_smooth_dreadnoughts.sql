CREATE TABLE `student_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentName` varchar(120) NOT NULL,
	`hits` int NOT NULL DEFAULT 0,
	`errors` int NOT NULL DEFAULT 0,
	`attempts` int NOT NULL DEFAULT 0,
	`levelsDone` json NOT NULL,
	`levelHits` json NOT NULL,
	`levelErrors` json NOT NULL,
	`timePerLevel` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_progress_studentName_unique` UNIQUE(`studentName`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
