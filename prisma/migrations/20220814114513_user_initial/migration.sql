-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'EMPlOYEE', 'EMPLOYER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "userType" "UserType" NOT NULL DEFAULT 'EMPlOYEE',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photoUrl" TEXT,
    "description" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "penaltyDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
