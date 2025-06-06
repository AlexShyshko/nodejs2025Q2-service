/*
  Warnings:

  - You are about to alter the column `createdAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updatedAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - A unique constraint covering the columns `[login]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE INTEGER,
ALTER COLUMN "updatedAt" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
