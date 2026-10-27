CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentNumber` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`sex` enum('F','M') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_studentNumber_unique` UNIQUE(`studentNumber`),
	CONSTRAINT `students_name_unique` UNIQUE(`name`)
);
