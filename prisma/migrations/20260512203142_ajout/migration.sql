-- CreateEnum
CREATE TYPE "ToolUnit" AS ENUM ('HEURE', 'ARE');

-- AlterTable
ALTER TABLE "Intervention" ADD COLUMN     "surface" DOUBLE PRECISION,
ALTER COLUMN "duration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "unit" "ToolUnit" NOT NULL DEFAULT 'HEURE';
