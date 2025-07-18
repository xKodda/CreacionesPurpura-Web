/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `newStock` to the `StockHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previousStock` to the `StockHistory` table without a default value. This is not possible if the table is not empty.
  - Made the column `reason` on table `StockHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "lastViewed" TIMESTAMP(3),
ADD COLUMN     "maxStock" INTEGER,
ADD COLUMN     "minStock" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "StockHistory" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "newStock" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "previousStock" INTEGER NOT NULL,
ALTER COLUMN "reason" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
