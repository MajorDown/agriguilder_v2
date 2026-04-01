/*
  Warnings:

  - Made the column `max_declaration_delay` on table `Guild` required. This step will fail if there are existing NULL values in that column.
  - Made the column `max_validation_delay` on table `Guild` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Guild" ALTER COLUMN "max_declaration_delay" SET NOT NULL,
ALTER COLUMN "max_declaration_delay" SET DEFAULT 7,
ALTER COLUMN "max_validation_delay" SET NOT NULL,
ALTER COLUMN "max_validation_delay" SET DEFAULT 2;
