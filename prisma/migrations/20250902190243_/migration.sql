/*
  Warnings:

  - You are about to drop the `memories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('positive', 'neutral', 'negative');

-- DropForeignKey
ALTER TABLE "memories" DROP CONSTRAINT "memories_userId_fkey";

-- DropTable
DROP TABLE "memories";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "mood" "Mood" NOT NULL DEFAULT 'neutral',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Memory_userId_date_idx" ON "Memory"("userId", "date" DESC);

-- CreateIndex
CREATE INDEX "Memory_userId_mood_idx" ON "Memory"("userId", "mood");
