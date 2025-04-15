/*
  Warnings:

  - You are about to drop the `Confession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Doubt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoubtAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoubtAnswerUpvote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Doubt" DROP CONSTRAINT "Doubt_userId_fkey";

-- DropForeignKey
ALTER TABLE "DoubtAnswer" DROP CONSTRAINT "DoubtAnswer_doubtId_fkey";

-- DropForeignKey
ALTER TABLE "DoubtAnswer" DROP CONSTRAINT "DoubtAnswer_userId_fkey";

-- DropForeignKey
ALTER TABLE "DoubtAnswerUpvote" DROP CONSTRAINT "DoubtAnswerUpvote_answerId_fkey";

-- DropForeignKey
ALTER TABLE "DoubtAnswerUpvote" DROP CONSTRAINT "DoubtAnswerUpvote_userId_fkey";

-- DropTable
DROP TABLE "Confession";

-- DropTable
DROP TABLE "Doubt";

-- DropTable
DROP TABLE "DoubtAnswer";

-- DropTable
DROP TABLE "DoubtAnswerUpvote";

-- CreateTable
CREATE TABLE "Gossip" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gossip_pkey" PRIMARY KEY ("id")
);
