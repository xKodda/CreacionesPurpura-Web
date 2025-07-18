/*
  Warnings:

  - A unique constraint covering the columns `[name,regionId]` on the table `Comuna` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Comuna_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Comuna_name_regionId_key" ON "Comuna"("name", "regionId");
