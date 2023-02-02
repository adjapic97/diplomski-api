/*
  Warnings:

  - You are about to drop the column `userHasJobPostId` on the `Offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "userHasJobPostId";

-- AlterTable
ALTER TABLE "job_posts" ALTER COLUMN "time" DROP NOT NULL;
