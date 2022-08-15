-- CreateEnum
CREATE TYPE "RankLevel" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateTable
CREATE TABLE "ranks" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "minReviews" INTEGER NOT NULL,
    "maxReviews" INTEGER NOT NULL,
    "minGrade" DECIMAL(65,30) NOT NULL,
    "maxGrade" DECIMAL(65,30) NOT NULL,
    "rankLevel" TEXT NOT NULL,

    CONSTRAINT "ranks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ranks_rankLevel_key" ON "ranks"("rankLevel");
