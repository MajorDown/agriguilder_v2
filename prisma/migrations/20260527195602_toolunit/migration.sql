/*
  Warnings:

  - The values [ARE] on the enum `ToolUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ToolUnit_new" AS ENUM ('HEURE', 'HECTARE');
ALTER TABLE "public"."Tool" ALTER COLUMN "unit" DROP DEFAULT;
ALTER TABLE "Tool" ALTER COLUMN "unit" TYPE "ToolUnit_new" USING ("unit"::text::"ToolUnit_new");
ALTER TYPE "ToolUnit" RENAME TO "ToolUnit_old";
ALTER TYPE "ToolUnit_new" RENAME TO "ToolUnit";
DROP TYPE "public"."ToolUnit_old";
ALTER TABLE "Tool" ALTER COLUMN "unit" SET DEFAULT 'HEURE';
COMMIT;
