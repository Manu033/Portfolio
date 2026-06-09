import cron from 'node-cron'
import prisma from '../utils/prismaClient.js'

const DAYS_BEFORE_ALERT = 7

export const checkUpcomingMaintenances = async () => {
  const today = new Date()
  const alertDate = new Date(today)
  alertDate.setDate(alertDate.getDate() + DAYS_BEFORE_ALERT)

  const upcoming = await prisma.maintenance.findMany({
    where: {
      nextMaintenanceDate: {
        gte: today,
        lte: alertDate,
      },
      nextMaintenanceNotified: false,
    },
    include: {
      car: { select: { brand: true, model: true, year: true, licensePlate: true } },
    },
  })

  if (upcoming.length > 0) {
    console.log(`[Notificaciones] ${upcoming.length} mantenimiento(s) próximo(s) en los próximos ${DAYS_BEFORE_ALERT} días:`)
    for (const m of upcoming) {
      console.log(`  - ${m.car.brand} ${m.car.model} (${m.car.licensePlate}): ${m.type} — ${m.nextMaintenanceDate.toLocaleDateString('es-AR')}`)
    }

    // Mark as notified
    await prisma.maintenance.updateMany({
      where: { id: { in: upcoming.map((m) => m.id) } },
      data: { nextMaintenanceNotified: true },
    })
  }

  return upcoming
}

// Run every day at 9:00 AM
export const startNotificationCron = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('[Cron] Verificando mantenimientos próximos...')
    await checkUpcomingMaintenances()
  })
  console.log('[Cron] Servicio de notificaciones iniciado (diario a las 9:00 AM)')
}
