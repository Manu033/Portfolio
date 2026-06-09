import prisma from '../utils/prismaClient.js'
import fs from 'fs'
import path from 'path'

export const getMaintenancesByCarId = async (req, res) => {
  try {
    const { carId } = req.params
    const car = await prisma.car.findFirst({ where: { id: carId, userId: req.userId } })
    if (!car) return res.status(404).json({ error: 'Auto no encontrado' })

    const maintenances = await prisma.maintenance.findMany({
      where: { carId },
      include: { photos: true },
      orderBy: { date: 'desc' },
    })
    res.json(maintenances)
  } catch {
    res.status(500).json({ error: 'Error al obtener los mantenimientos' })
  }
}

export const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await prisma.maintenance.findFirst({
      where: { id: req.params.id, car: { userId: req.userId } },
      include: { photos: true, car: true },
    })
    if (!maintenance) return res.status(404).json({ error: 'Mantenimiento no encontrado' })
    res.json(maintenance)
  } catch {
    res.status(500).json({ error: 'Error al obtener el mantenimiento' })
  }
}

export const createMaintenance = async (req, res) => {
  try {
    const { carId } = req.params
    const { type, date, place, mechanic, description, cost, nextMaintenanceDate, nextMaintenanceKm } = req.body

    const car = await prisma.car.findFirst({ where: { id: carId, userId: req.userId } })
    if (!car) return res.status(404).json({ error: 'Auto no encontrado' })

    const photos = (req.files || []).map((f) => ({
      photoUrl: `/uploads/maintenances/${f.filename}`,
      fileName: f.originalname,
    }))

    const maintenance = await prisma.maintenance.create({
      data: {
        carId,
        type,
        date: new Date(date),
        place: place || null,
        mechanic: mechanic || null,
        description: description || null,
        cost: cost ? parseFloat(cost) : null,
        nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
        nextMaintenanceKm: nextMaintenanceKm ? parseInt(nextMaintenanceKm) : null,
        photos: { create: photos },
      },
      include: { photos: true },
    })
    res.status(201).json(maintenance)
  } catch {
    res.status(500).json({ error: 'Error al crear el mantenimiento' })
  }
}

export const updateMaintenance = async (req, res) => {
  try {
    const { type, date, place, mechanic, description, cost, nextMaintenanceDate, nextMaintenanceKm } = req.body

    const existing = await prisma.maintenance.findFirst({
      where: { id: req.params.id, car: { userId: req.userId } },
    })
    if (!existing) return res.status(404).json({ error: 'Mantenimiento no encontrado' })

    const newPhotos = (req.files || []).map((f) => ({
      photoUrl: `/uploads/maintenances/${f.filename}`,
      fileName: f.originalname,
    }))

    const maintenance = await prisma.maintenance.update({
      where: { id: req.params.id },
      data: {
        type,
        date: new Date(date),
        place: place || null,
        mechanic: mechanic || null,
        description: description || null,
        cost: cost ? parseFloat(cost) : null,
        nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
        nextMaintenanceKm: nextMaintenanceKm ? parseInt(nextMaintenanceKm) : null,
        nextMaintenanceNotified:
          existing.nextMaintenanceDate?.getTime() !== new Date(nextMaintenanceDate)?.getTime()
            ? false
            : existing.nextMaintenanceNotified,
        ...(newPhotos.length > 0 && { photos: { create: newPhotos } }),
      },
      include: { photos: true },
    })
    res.json(maintenance)
  } catch {
    res.status(500).json({ error: 'Error al actualizar el mantenimiento' })
  }
}

export const deleteMaintenance = async (req, res) => {
  try {
    const existing = await prisma.maintenance.findFirst({
      where: { id: req.params.id, car: { userId: req.userId } },
      include: { photos: true },
    })
    if (!existing) return res.status(404).json({ error: 'Mantenimiento no encontrado' })

    for (const p of existing.photos) {
      const filePath = path.join(process.cwd(), p.photoUrl)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    await prisma.maintenance.delete({ where: { id: req.params.id } })
    res.json({ message: 'Mantenimiento eliminado correctamente' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar el mantenimiento' })
  }
}

export const deleteMaintenancePhoto = async (req, res) => {
  try {
    const photo = await prisma.maintenancePhoto.findFirst({
      where: {
        id: req.params.photoId,
        maintenance: { car: { userId: req.userId } },
      },
    })
    if (!photo) return res.status(404).json({ error: 'Foto no encontrada' })

    const filePath = path.join(process.cwd(), photo.photoUrl)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    await prisma.maintenancePhoto.delete({ where: { id: req.params.photoId } })
    res.json({ message: 'Foto eliminada correctamente' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar la foto' })
  }
}

export const getUpcomingMaintenances = async (req, res) => {
  try {
    const today = new Date()
    const inDays = parseInt(req.query.days) || 30
    const futureDate = new Date(today)
    futureDate.setDate(futureDate.getDate() + inDays)

    const maintenances = await prisma.maintenance.findMany({
      where: {
        nextMaintenanceDate: { gte: today, lte: futureDate },
        car: { userId: req.userId },
      },
      include: {
        car: { select: { brand: true, model: true, year: true, licensePlate: true } },
      },
      orderBy: { nextMaintenanceDate: 'asc' },
    })
    res.json(maintenances)
  } catch {
    res.status(500).json({ error: 'Error al obtener los próximos mantenimientos' })
  }
}
