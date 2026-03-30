-- AlterTable
ALTER TABLE "EmailAuthCode" ADD COLUMN     "errors" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "validated_at" TIMESTAMP(3);
