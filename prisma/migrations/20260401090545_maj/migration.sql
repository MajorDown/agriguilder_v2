/*
  Warnings:

  - You are about to drop the column `validation_delay` on the `Guild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "validation_delay",
ADD COLUMN     "max_declaration_delay" INTEGER,
ADD COLUMN     "max_validation_delay" INTEGER;
