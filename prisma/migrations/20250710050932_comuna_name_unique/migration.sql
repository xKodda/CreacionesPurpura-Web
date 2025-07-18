/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Comuna` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comuna_name_key" ON "Comuna"("name");
