/*
  Warnings:

  - You are about to drop the column `point_euro_value` on the `Guild` table. All the data in the column will be lost.
  - Added the required column `point_euro_value` to the `Reinitialization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "point_euro_value",
ALTER COLUMN "human_hour_point_value" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Reinitialization" ADD COLUMN     "point_euro_value" DOUBLE PRECISION NOT NULL;
