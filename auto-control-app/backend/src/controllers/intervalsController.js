import prisma from '../utils/prismaClient.js'

export const getIntervals = async (req, res) => {
  try {
    const intervals = await prisma.maintenanceInterval.findMany({
      orderBy: { name: 'asc' },
    })
    res.json(intervals)
  } catch {
    res.status(500).json({ error: 'Error al obtener los intervalos' })
  }
}

export const getIntervalsByType = async (req, res) => {
  try {
    const { type } = req.params
    const intervals = await prisma.maintenanceInterval.findMany({
      where: { maintenanceType: type },
      orderBy: { intervalKm: 'asc' },
    })
    res.json(intervals)
  } catch {
    res.status(500).json({ error: 'Error al obtener el intervalo' })
  }
}

export const createInterval = async (req, res) => {
  try {
    const { name, maintenanceType, intervalKm, intervalMonths } = req.body
    const interval = await prisma.maintenanceInterval.create({
      data: {
        name,
        maintenanceType: maintenanceType || null,
        intervalKm: intervalKm ? parseInt(intervalKm) : null,
        intervalMonths: intervalMonths ? parseInt(intervalMonths) : null,
      },
    })
    res.status(201).json(interval)
  } catch {
    res.status(500).json({ error: 'Error al crear el intervalo' })
  }
}

export const updateInterval = async (req, res) => {
  try {
    const { name, maintenanceType, intervalKm, intervalMonths } = req.body
    const existing = await prisma.maintenanceInterval.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Intervalo no encontrado' })

    const interval = await prisma.maintenanceInterval.update({
      where: { id: req.params.id },
      data: {
        name,
        maintenanceType: maintenanceType || null,
        intervalKm: intervalKm ? parseInt(intervalKm) : null,
        intervalMonths: intervalMonths ? parseInt(intervalMonths) : null,
      },
    })
    res.json(interval)
  } catch {
    res.status(500).json({ error: 'Error al actualizar el intervalo' })
  }
}

export const deleteInterval = async (req, res) => {
  try {
    const existing = await prisma.maintenanceInterval.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Intervalo no encontrado' })
    await prisma.maintenanceInterval.delete({ where: { id: req.params.id } })
    res.json({ message: 'Intervalo eliminado' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar el intervalo' })
  }
}
