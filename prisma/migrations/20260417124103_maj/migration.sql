/*
  Warnings:

  - You are about to drop the column `updated_at` on the `Contestation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contestation" DROP COLUMN "updated_at",
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "resolved_by_admin_id" TEXT;

-- AddForeignKey
ALTER TABLE "Contestation" ADD CONSTRAINT "Contestation_resolved_by_admin_id_guild_id_fkey" FOREIGN KEY ("resolved_by_admin_id", "guild_id") REFERENCES "Admin"("id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;
