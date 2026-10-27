CREATE TABLE `student_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentName` varchar(120) NOT NULL,
	`level` int NOT NULL,
	`exercise` int NOT NULL,
	`activityType` varchar(20) NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`expectedAnswer` text,
	`isCorrect` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `student_answers_id` PRIMARY KEY(`id`)
);
