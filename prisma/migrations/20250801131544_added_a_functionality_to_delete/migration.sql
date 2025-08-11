/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `MarketplaceProduct` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `MarketplaceProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarketplaceProduct" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceProduct_publicId_key" ON "MarketplaceProduct"("publicId");
