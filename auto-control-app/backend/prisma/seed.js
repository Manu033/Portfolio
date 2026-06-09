import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const intervals = [
  { name: 'Cambio de aceite y filtro', maintenanceType: 'OIL_CHANGE',     intervalKm: 10000, intervalMonths: 12   },
  { name: 'Filtro de aire',            maintenanceType: 'FILTER_CHANGE',   intervalKm: 20000, intervalMonths: 24   },
  { name: 'Filtro de combustible',     maintenanceType: 'FILTER_CHANGE',   intervalKm: 30000, intervalMonths: 24   },
  { name: 'Correa de distribución',    maintenanceType: 'BELT_CHANGE',     intervalKm: 60000, intervalMonths: 48   },
  { name: 'Bujías',                    maintenanceType: 'SPARK_PLUGS',     intervalKm: 30000, intervalMonths: 24   },
  { name: 'Líquido de frenos',         maintenanceType: 'BRAKE_SERVICE',   intervalKm: 40000, intervalMonths: 24   },
  { name: 'Pastillas de freno',        maintenanceType: 'BRAKE_SERVICE',   intervalKm: 30000, intervalMonths: null },
  { name: 'Alineación y balanceo',     maintenanceType: 'ALIGNMENT',       intervalKm: 10000, intervalMonths: 12   },
  { name: 'Cambio de neumáticos',      maintenanceType: 'TIRE_CHANGE',     intervalKm: 40000, intervalMonths: null },
  { name: 'Líquido refrigerante',      maintenanceType: 'COOLING_SYSTEM',  intervalKm: 40000, intervalMonths: 24   },
  { name: 'Caja de dirección',         maintenanceType: 'SUSPENSION',      intervalKm: 50000, intervalMonths: null },
  { name: 'Amortiguadores',            maintenanceType: 'SUSPENSION',      intervalKm: 60000, intervalMonths: null },
  { name: 'Transmisión / caja',        maintenanceType: 'TRANSMISSION',    intervalKm: 60000, intervalMonths: 48   },
]

async function main() {
  await prisma.maintenanceInterval.deleteMany()
  await prisma.maintenanceInterval.createMany({ data: intervals })
  console.log(`Seeded ${intervals.length} maintenance intervals.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
