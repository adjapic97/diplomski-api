-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- AlterTable
ALTER TABLE "job_posts" ALTER COLUMN "fixedPrice" SET DEFAULT true;

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "rating" DECIMAL(65,30) NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "reviewerEmail" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "jobPostId" TEXT NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills_on_users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "skillLevel" "SkillLevel" NOT NULL DEFAULT 'BEGINNER',
    "skillId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "skills_on_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills_on_job_posts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "skillLevelNeeded" "SkillLevel" NOT NULL DEFAULT 'BEGINNER',
    "jobPostId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "skills_on_job_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories_on_job_posts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "jobPostId" TEXT NOT NULL,

    CONSTRAINT "categories_on_job_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cities_postalCode_key" ON "cities"("postalCode");

-- CreateIndex
CREATE UNIQUE INDEX "cities_addressId_key" ON "cities"("addressId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "job_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills_on_users" ADD CONSTRAINT "skills_on_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills_on_users" ADD CONSTRAINT "skills_on_users_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills_on_job_posts" ADD CONSTRAINT "skills_on_job_posts_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "job_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills_on_job_posts" ADD CONSTRAINT "skills_on_job_posts_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_on_job_posts" ADD CONSTRAINT "categories_on_job_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_on_job_posts" ADD CONSTRAINT "categories_on_job_posts_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "job_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
