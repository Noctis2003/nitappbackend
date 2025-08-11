/*
  Warnings:

  - You are about to drop the `ForumLike` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `likes` to the `ForumPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ForumLike" DROP CONSTRAINT "ForumLike_postId_fkey";

-- DropForeignKey
ALTER TABLE "ForumLike" DROP CONSTRAINT "ForumLike_userId_fkey";

-- AlterTable
ALTER TABLE "ForumPost" ADD COLUMN     "likes" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ForumLike";
