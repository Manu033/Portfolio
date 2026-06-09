-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('OIL_CHANGE', 'TIRE_CHANGE', 'ALIGNMENT', 'BALANCING', 'BELT_CHANGE', 'BRAKE_SERVICE', 'FILTER_CHANGE', 'SPARK_PLUGS', 'BATTERY', 'SUSPENSION', 'TRANSMISSION', 'COOLING_SYSTEM', 'ELECTRICAL', 'GENERAL_SERVICE', 'OTHER');

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "photoUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenances" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "place" TEXT,
    "mechanic" TEXT,
    "description" TEXT,
    "cost" DECIMAL(10,2),
    "nextMaintenanceDate" TIMESTAMP(3),
    "nextMaintenanceNotified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_photos" (
    "id" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cars_licensePlate_key" ON "cars"("licensePlate");

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_photos" ADD CONSTRAINT "maintenance_photos_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "maintenances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
