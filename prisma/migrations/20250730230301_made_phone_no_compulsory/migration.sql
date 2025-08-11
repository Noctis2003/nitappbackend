/*
  Warnings:

  - Made the column `phone` on table `MarketplaceProduct` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MarketplaceProduct" ALTER COLUMN "phone" SET NOT NULL;
