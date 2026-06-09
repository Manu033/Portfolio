import { Router } from 'express'
import prisma from '../utils/prismaClient.js'
import { generateMaintenancePDF } from '../services/pdfService.js'

const router = Router()

router.get('/cars/:id/export', async (req, res) => {
  try {
    const car = await prisma.car.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: {
        maintenances: {
          include: { photos: true },
          orderBy: { date: 'desc' },
        },
      },
    })

    if (!car) return res.status(404).json({ error: 'Auto no encontrado' })

    const filename = `historial_${car.licensePlate}_${Date.now()}.pdf`
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

    generateMaintenancePDF(car, car.maintenances, res)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al generar el PDF' })
  }
})

export default router
