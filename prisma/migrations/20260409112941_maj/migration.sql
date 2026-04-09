/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "max_contestation_delay" INTEGER NOT NULL DEFAULT 7,
ALTER COLUMN "max_validation_delay" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Guild_name_key" ON "Guild"("name");
