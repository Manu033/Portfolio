import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prismaClient.js'

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    const token = signToken(user.id)
    res.status(201).json({ token, user })
  } catch {
    res.status(500).json({ error: 'Error al registrar el usuario' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' })
    }

    const token = signToken(user.id)
    const { password: _, ...userWithoutPassword } = user
    res.json({ token, user: userWithoutPassword })
  } catch {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body
    if (!name?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true, createdAt: true },
    })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Error al actualizar el perfil' })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Completá todos los campos' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) return res.status(401).json({ error: 'La contraseña actual es incorrecta' })

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: req.userId }, data: { password: hashed } })
    res.json({ message: 'Contraseña actualizada correctamente' })
  } catch {
    res.status(500).json({ error: 'Error al cambiar la contraseña' })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Error al obtener el usuario' })
  }
}
