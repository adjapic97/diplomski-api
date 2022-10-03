/*
  Warnings:

  - You are about to drop the column `reviewerEmail` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `reviewerName` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `description` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userHasJobPostId` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewOnUserJobId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "userHasJobPostId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "reviewerEmail",
DROP COLUMN "reviewerName",
ADD COLUMN     "reviewOnUserJobId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user_has_job_post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amountEarned" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "offerId" TEXT NOT NULL,

    CONSTRAINT "user_has_job_post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_has_job_post_offerId_key" ON "user_has_job_post"("offerId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewOnUserJobId_fkey" FOREIGN KEY ("reviewOnUserJobId") REFERENCES "user_has_job_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_has_job_post" ADD CONSTRAINT "user_has_job_post_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
