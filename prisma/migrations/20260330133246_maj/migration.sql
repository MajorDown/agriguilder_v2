-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "ended_at" TIMESTAMP(3),
ADD COLUMN     "revoked_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "revoked_at" TIMESTAMP(3);
