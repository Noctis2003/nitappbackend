/*
  Warnings:

  - Added the required column `userId` to the `Gossip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gossip" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Gossip" ADD CONSTRAINT "Gossip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
