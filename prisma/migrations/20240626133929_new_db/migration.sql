/*
  Warnings:

  - You are about to drop the column `productId` on the `CampaignProduct` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[variantId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `variantId` to the `CampaignProduct` table without a default value. This is not possible if the table is not empty.
  - Made the column `shopId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `handle` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `variantId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `variantOptionValue1` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inventoryAvailableQty` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `variantPrice` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recordCreatedAt` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recordUpdatedAt` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inventoryAvailable` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendor` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CampaignProduct" DROP CONSTRAINT "CampaignProduct_productId_fkey";

-- DropIndex
DROP INDEX "CampaignProduct_productId_idx";

-- AlterTable
ALTER TABLE "CampaignProduct" DROP COLUMN "productId",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "shopId" SET NOT NULL,
ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "handle" SET NOT NULL,
ALTER COLUMN "variantId" SET NOT NULL,
ALTER COLUMN "variantOptionValue1" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "inventoryAvailableQty" SET NOT NULL,
ALTER COLUMN "variantPrice" SET NOT NULL,
ALTER COLUMN "recordCreatedAt" SET NOT NULL,
ALTER COLUMN "recordUpdatedAt" SET NOT NULL,
ALTER COLUMN "inventoryAvailable" SET NOT NULL,
ALTER COLUMN "vendor" SET NOT NULL;

-- CreateIndex
CREATE INDEX "CampaignProduct_variantId_idx" ON "CampaignProduct"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_variantId_key" ON "Product"("variantId");

-- AddForeignKey
ALTER TABLE "CampaignProduct" ADD CONSTRAINT "CampaignProduct_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Product"("variantId") ON DELETE RESTRICT ON UPDATE CASCADE;
