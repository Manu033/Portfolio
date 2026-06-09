-- AlterTable
ALTER TABLE "maintenances" ADD COLUMN     "nextMaintenanceKm" INTEGER;

-- CreateTable
CREATE TABLE "maintenance_intervals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "maintenanceType" "MaintenanceType",
    "intervalKm" INTEGER,
    "intervalMonths" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_intervals_pkey" PRIMARY KEY ("id")
);
