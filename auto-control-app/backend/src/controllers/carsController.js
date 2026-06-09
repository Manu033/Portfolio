import prisma from '../utils/prismaClient.js'
import fs from 'fs'
import path from 'path'

export const getCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      where: { userId: req.userId },
      include: {
        _count: { select: { maintenances: true } },
        maintenances: {
          orderBy: { nextMaintenanceDate: 'asc' },
          where: { nextMaintenanceDate: { gte: new Date() } },
          take: 1,
          select: { nextMaintenanceDate: true, type: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(cars)
  } catch {
    res.status(500).json({ error: 'Error al obtener los autos' })
  }
}

export const getCarById = async (req, res) => {
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
    res.json(car)
  } catch {
    res.status(500).json({ error: 'Error al obtener el auto' })
  }
}

export const createCar = async (req, res) => {
  try {
    const { brand, model, year, licensePlate, notes } = req.body
    const photoUrl = req.file ? `/uploads/cars/${req.file.filename}` : null

    const car = await prisma.car.create({
      data: {
        userId: req.userId,
        brand,
        model,
        year: parseInt(year),
        licensePlate: licensePlate.toUpperCase(),
        photoUrl,
        notes,
      },
    })
    res.status(201).json(car)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un auto con esa patente' })
    }
    res.status(500).json({ error: 'Error al crear el auto' })
  }
}

export const updateCar = async (req, res) => {
  try {
    const { brand, model, year, licensePlate, notes } = req.body
    const existing = await prisma.car.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })
    if (!existing) return res.status(404).json({ error: 'Auto no encontrado' })

    let photoUrl = existing.photoUrl
    if (req.file) {
      if (existing.photoUrl) {
        const oldPath = path.join(process.cwd(), existing.photoUrl)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      }
      photoUrl = `/uploads/cars/${req.file.filename}`
    }

    const car = await prisma.car.update({
      where: { id: req.params.id },
      data: {
        brand,
        model,
        year: parseInt(year),
        licensePlate: licensePlate.toUpperCase(),
        photoUrl,
        notes,
      },
    })
    res.json(car)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un auto con esa patente' })
    }
    res.status(500).json({ error: 'Error al actualizar el auto' })
  }
}

export const deleteCar = async (req, res) => {
  try {
    const existing = await prisma.car.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { maintenances: { include: { photos: true } } },
    })
    if (!existing) return res.status(404).json({ error: 'Auto no encontrado' })

    if (existing.photoUrl) {
      const filePath = path.join(process.cwd(), existing.photoUrl)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    for (const m of existing.maintenances) {
      for (const p of m.photos) {
        const filePath = path.join(process.cwd(), p.photoUrl)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      }
    }

    await prisma.car.delete({ where: { id: req.params.id } })
    res.json({ message: 'Auto eliminado correctamente' })
  } catch {
    res.status(500).json({ error: 'Error al eliminar el auto' })
  }
}
