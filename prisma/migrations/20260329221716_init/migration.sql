-- CreateEnum
CREATE TYPE "EmailAuthCodeContext" AS ENUM ('INSCRIPTION', 'MAJ_EMAIL');

-- CreateEnum
CREATE TYPE "AdjustmentType" AS ENUM ('INITIALISATION', 'CORRECTION');

-- CreateEnum
CREATE TYPE "InterventionStatus" AS ENUM ('DECLARE', 'VALIDEE', 'CONTESTEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "ContestationStatus" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OUVERT', 'EXPIRE', 'RESERVE', 'ANNULE');

-- CreateTable
CREATE TABLE "EmailAuthCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "context" "EmailAuthCodeContext" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailAuthCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "society" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ip_mask" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "city" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "point_euro_value" DOUBLE PRECISION NOT NULL,
    "human_hour_point_value" DOUBLE PRECISION NOT NULL,
    "validation_delay" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "points_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reinitialization" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reinitialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coef" DOUBLE PRECISION NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adjustment" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "type" "AdjustmentType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Adjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intervention" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "payer_id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "status" "InterventionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contestation" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "intervention_id" TEXT NOT NULL,
    "contester_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ContestationStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contestation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "planned_day" TIMESTAMP(3),
    "expected_duration" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'OUVERT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RequestVolunteers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RequestVolunteers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_InterventionToTool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InterventionToTool_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "EmailAuthCode_email_idx" ON "EmailAuthCode"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_user_id_idx" ON "Session"("user_id");

-- CreateIndex
CREATE INDEX "Member_guild_id_idx" ON "Member"("guild_id");

-- CreateIndex
CREATE INDEX "Member_user_id_idx" ON "Member"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Member_guild_id_user_id_key" ON "Member"("guild_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Member_id_guild_id_key" ON "Member"("id", "guild_id");

-- CreateIndex
CREATE INDEX "Admin_guild_id_idx" ON "Admin"("guild_id");

-- CreateIndex
CREATE INDEX "Admin_user_id_idx" ON "Admin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_guild_id_user_id_key" ON "Admin"("guild_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_guild_id_key" ON "Admin"("id", "guild_id");

-- CreateIndex
CREATE INDEX "Employee_guild_id_idx" ON "Employee"("guild_id");

-- CreateIndex
CREATE INDEX "Employee_user_id_idx" ON "Employee"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_guild_id_user_id_key" ON "Employee"("guild_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_id_guild_id_key" ON "Employee"("id", "guild_id");

-- CreateIndex
CREATE INDEX "Reinitialization_guild_id_idx" ON "Reinitialization"("guild_id");

-- CreateIndex
CREATE INDEX "Reinitialization_admin_id_idx" ON "Reinitialization"("admin_id");

-- CreateIndex
CREATE INDEX "Rule_guild_id_idx" ON "Rule"("guild_id");

-- CreateIndex
CREATE INDEX "Rule_admin_id_idx" ON "Rule"("admin_id");

-- CreateIndex
CREATE INDEX "Tool_guild_id_idx" ON "Tool"("guild_id");

-- CreateIndex
CREATE INDEX "Tool_admin_id_idx" ON "Tool"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_guild_id_name_version_key" ON "Tool"("guild_id", "name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_id_guild_id_key" ON "Tool"("id", "guild_id");

-- CreateIndex
CREATE INDEX "Adjustment_guild_id_idx" ON "Adjustment"("guild_id");

-- CreateIndex
CREATE INDEX "Adjustment_member_id_idx" ON "Adjustment"("member_id");

-- CreateIndex
CREATE INDEX "Intervention_guild_id_idx" ON "Intervention"("guild_id");

-- CreateIndex
CREATE INDEX "Intervention_worker_id_idx" ON "Intervention"("worker_id");

-- CreateIndex
CREATE INDEX "Intervention_payer_id_idx" ON "Intervention"("payer_id");

-- CreateIndex
CREATE INDEX "Intervention_guild_id_status_idx" ON "Intervention"("guild_id", "status");

-- CreateIndex
CREATE INDEX "Intervention_guild_id_day_idx" ON "Intervention"("guild_id", "day");

-- CreateIndex
CREATE INDEX "Contestation_guild_id_idx" ON "Contestation"("guild_id");

-- CreateIndex
CREATE INDEX "Contestation_intervention_id_idx" ON "Contestation"("intervention_id");

-- CreateIndex
CREATE INDEX "Contestation_guild_id_status_idx" ON "Contestation"("guild_id", "status");

-- CreateIndex
CREATE INDEX "Request_guild_id_idx" ON "Request"("guild_id");

-- CreateIndex
CREATE INDEX "Request_guild_id_status_idx" ON "Request"("guild_id", "status");

-- CreateIndex
CREATE INDEX "Request_guild_id_planned_day_idx" ON "Request"("guild_id", "planned_day");

-- CreateIndex
CREATE INDEX "_RequestVolunteers_B_index" ON "_RequestVolunteers"("B");

-- CreateIndex
CREATE INDEX "_InterventionToTool_B_index" ON "_InterventionToTool"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reinitialization" ADD CONSTRAINT "Reinitialization_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reinitialization" ADD CONSTRAINT "Reinitialization_admin_id_guild_id_fkey" FOREIGN KEY ("admin_id", "guild_id") REFERENCES "Admin"("id", "guild_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_admin_id_guild_id_fkey" FOREIGN KEY ("admin_id", "guild_id") REFERENCES "Admin"("id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_admin_id_guild_id_fkey" FOREIGN KEY ("admin_id", "guild_id") REFERENCES "Admin"("id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjustment" ADD CONSTRAINT "Adjustment_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjustment" ADD CONSTRAINT "Adjustment_admin_id_guild_id_fkey" FOREIGN KEY ("admin_id", "guild_id") REFERENCES "Admin"("id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjustment" ADD CONSTRAINT "Adjustment_member_id_guild_id_fkey" FOREIGN KEY ("member_id", "guild_id") REFERENCES "Member"("id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_worker_id_guild_id_fkey" FOREIGN KEY ("worker_id", "guild_id") REFERENCES "Member"("id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_payer_id_guild_id_fkey" FOREIGN KEY ("payer_id", "guild_id") REFERENCES "Member"("id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contestation" ADD CONSTRAINT "Contestation_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contestation" ADD CONSTRAINT "Contestation_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "Intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contestation" ADD CONSTRAINT "Contestation_contester_id_guild_id_fkey" FOREIGN KEY ("contester_id", "guild_id") REFERENCES "Member"("id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_requester_id_guild_id_fkey" FOREIGN KEY ("requester_id", "guild_id") REFERENCES "Member"("id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestVolunteers" ADD CONSTRAINT "_RequestVolunteers_A_fkey" FOREIGN KEY ("A") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestVolunteers" ADD CONSTRAINT "_RequestVolunteers_B_fkey" FOREIGN KEY ("B") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterventionToTool" ADD CONSTRAINT "_InterventionToTool_A_fkey" FOREIGN KEY ("A") REFERENCES "Intervention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterventionToTool" ADD CONSTRAINT "_InterventionToTool_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
